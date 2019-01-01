package com.afx.web.receiptorganizer.service.receipt;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

import com.afx.web.receiptorganizer.dao.model.receipt.Receipt;
import com.afx.web.receiptorganizer.dao.model.receipt.ReceiptFile;
import com.afx.web.receiptorganizer.dao.receipt.ReceiptDao;
import com.afx.web.receiptorganizer.rest.model.response.receipt.ReceiptPage;
import com.afx.web.receiptorganizer.service.receipt.receiptparser.LogoAndDocumentResponse;
import com.afx.web.receiptorganizer.service.receipt.receiptparser.ReceiptParser;
import com.afx.web.receiptorganizer.service.receipt.receiptparser.factory.ReceiptParserFactory;
import com.afx.web.receiptorganizer.utilities.ImageThumbnailCreator;
import com.afx.web.receiptorganizer.utilities.PDFImageCreator;
import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.BatchAnnotateImagesResponse;
import com.google.cloud.vision.v1.EntityAnnotation;
import com.google.cloud.vision.v1.Feature;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.cloud.vision.v1.TextAnnotation;
import com.google.protobuf.ByteString;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ReceiptServiceV1 implements ReceiptService {

    /*
     * Constants
     */

    @Value("${receipts.thumbnailHeight}")
    private int THUMBNAIL_HEIGHT;
    @Value("${receipts.thumbnailWidth}")
    private int THUMBNAIL_WIDTH;

    /*
     * Private static variables
     */

    private static Logger logger = LogManager.getLogger(ReceiptServiceV1.class);

    /*
     * Private fields
     */

    @Autowired
    private ReceiptDao receiptDao;

    @Autowired
    private ReceiptParserFactory receiptParserFactory;

    public Receipt addReceipt(String username, Receipt receipt, boolean skipOcr) throws Exception {
        if (receipt.getMIME() != null && !receipt.getMIME().equals("application/pdf") && skipOcr == false) {
            LogoAndDocumentResponse ocrResponse = callVisionService(receipt.getFile());
            try {
                ReceiptParser parser = this.receiptParserFactory.getReceiptParser(ocrResponse.getLogoDescription());
                receipt = parser.parseReceipt(receipt, ocrResponse);
            } catch (IOException iox) {
                logger.error("Failed to convert user: " + username + " image for storage on database.");
                throw new RuntimeException(iox.getMessage());
            }
        } else if (receipt.getMIME() != null && receipt.getMIME().equals("application/pdf")) {
            // Setup receipt
            InputStream imageAsStream = new ByteArrayInputStream(receipt.getFile());
            BufferedImage image = PDFImageCreator.createImageOfPDFPage(imageAsStream, receipt.getFileName(), 0);

            // Convert pdf image back to bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(image, "jpg", outputStream);
            outputStream.flush();
            byte[] pdfImageAsBytes = outputStream.toByteArray();
            outputStream.close();

            receipt.setMIME("image/jpeg");
            receipt.setFile(pdfImageAsBytes);

            // Create byte array for thumbnail
            receipt.setThumbnail(ImageThumbnailCreator.createThumbnail(image, THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH));
            receipt.setThumbnailMIME("image/jpeg");
        } else {
            // Skip ocr selected on nonpdf file
            InputStream imageAsStream = new ByteArrayInputStream(receipt.getFile());
            BufferedImage image = ImageIO.read(imageAsStream);

            receipt.setThumbnail(ImageThumbnailCreator.createThumbnail(image, THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH));
            receipt.setThumbnailMIME("image/jpeg");
        }

        //Remove everything after the first period
        receipt.setFileName(receipt.getFileName().substring(0, receipt.getFileName().indexOf(".")));
        receipt.setOriginalFile(receipt.getFile());
        receipt.setOriginalMIME(receipt.getMIME());
        receipt.setId(this.receiptDao.addReceipt(username, receipt));
        return receipt;
    }

    public void deleteReceipt(String username, int receiptId) {
        this.receiptDao.deleteReceipt(username, receiptId);
    }

    public Receipt editReceipt(String username, Receipt receipt) {
        return this.receiptDao.editReceipt(username, receipt);
    }

    public Receipt getReceipt(String username, int receiptId) {
        return this.receiptDao.getReceipt(username, receiptId);
    }

    public ReceiptFile getReceiptFile(String username, int receiptId) {
        return this.receiptDao.getReceiptFile(username, receiptId);
    }

    public ReceiptFile getReceiptThumbnail(String username, int receiptId) {
        return this.receiptDao.getReceiptThumbnail(username, receiptId);
    }

    public ReceiptPage getReceiptPage(String username, String searchQuery, List<String> labelNames, int start, int numRows) {
        return this.receiptDao.getRangeUserReceipts(username, searchQuery, labelNames, start, numRows);
    }

    private static LogoAndDocumentResponse callVisionService(byte[] image) throws Exception {
        LogoAndDocumentResponse retVal = null;

        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {

            ByteString imgBytes = ByteString.copyFrom(image);

            // Builds the image annotation request
            List<AnnotateImageRequest> requests = new ArrayList<>();
            Image img = Image.newBuilder().setContent(imgBytes).build();
            Feature docFeat = Feature.newBuilder().setType(Feature.Type.DOCUMENT_TEXT_DETECTION).build();
            AnnotateImageRequest docRequest = AnnotateImageRequest.newBuilder().addFeatures(docFeat).setImage(img)
                    .build();
            Feature lblFeat = Feature.newBuilder().setType(Feature.Type.LOGO_DETECTION).build();
            AnnotateImageRequest lblRequest = AnnotateImageRequest.newBuilder().addFeatures(lblFeat).setImage(img)
                    .build();
            requests.add(lblRequest);
            requests.add(docRequest);

            // Performs label detection on the image file
            BatchAnnotateImagesResponse response = vision.batchAnnotateImages(requests);
            List<AnnotateImageResponse> responses = response.getResponsesList();

            retVal = new LogoAndDocumentResponse();
            for (AnnotateImageResponse res : responses) {
                if (res.hasError()) {
                    System.out.printf("Error: %s\n", res.getError().getMessage());
                    return retVal;
                }

                // Return top logo result and document text.
                List<EntityAnnotation> logoAnnotations = res.getLogoAnnotationsList();
                if (res.hasFullTextAnnotation()) {
                    TextAnnotation annotation = res.getFullTextAnnotation();
                    String description = annotation.getText().replaceAll("[^\\p{ASCII}]", "");
                    retVal.setDocumentText(description);
                } else if (logoAnnotations.size() != 0) {
                    retVal.setLogoDescription(logoAnnotations.get(0).getDescription());
                }
            }
        }

        return retVal;
    }
}