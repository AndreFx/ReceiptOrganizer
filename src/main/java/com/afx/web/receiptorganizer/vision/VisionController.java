package com.afx.web.receiptorganizer.vision;

import com.afx.web.receiptorganizer.dao.receipt.ReceiptDao;
import com.afx.web.receiptorganizer.receipts.ReceiptController;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.User;
import com.afx.web.receiptorganizer.utilities.ImageThumbnailCreator;
import com.afx.web.receiptorganizer.utilities.PDFImageCreator;
import com.afx.web.receiptorganizer.vision.responses.VisionJsonResponse;
import com.afx.web.receiptorganizer.vision.types.LogoAndDocumentResponse;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;


@Controller
@RequestMapping("/receipts/vision")
@SessionAttributes(value={"user"})
public class VisionController {

    /*
    Private static variables
     */

    private static Logger logger = LogManager.getLogger(VisionController.class);

    @Autowired
    private ReceiptDao receiptDao;

    private final static int MAX_DESCRIPTION_LENGTH = 500;

    @RequestMapping(value = "/ocr", produces={MediaType.APPLICATION_JSON_VALUE}, method = RequestMethod.POST)
    @ResponseBody
    public VisionJsonResponse getVisionResult(@RequestParam("receiptImage") MultipartFile receiptImage, @ModelAttribute("user") User user) throws Exception {
        logger.debug("User: " + user.getUsername() + " performing OCR on file: " + receiptImage.getOriginalFilename());

        VisionJsonResponse response = new VisionJsonResponse();
        boolean success = false;
        String errorMsg = "";
        Receipt data = null;

        if (!receiptImage.isEmpty()) {
            byte[] imageAsBytes = receiptImage.getBytes();
            InputStream imageAsStream = receiptImage.getInputStream();
            BufferedImage image;
            LogoAndDocumentResponse ocrResponse = null;

            //TODO Move OCR into helper?
            if (receiptImage.getContentType() != null && !receiptImage.getContentType().equals("application/pdf")) {
                ocrResponse = doOCR(imageAsBytes);
            }

            //TODO Create receipt object from ocr data
            //TODO Make a method for this, it gets really long
            data = new Receipt();
            data.setMIME(receiptImage.getContentType());
            data.setOriginalFileName(receiptImage.getOriginalFilename());

            //Only for ocr compatible receipts
            if (ocrResponse != null) {
                data.setDescription(ocrResponse.getDocumentText());
            }
            try {
                if (data.getMIME().equals("application/pdf")) {
                    image = PDFImageCreator.createImageOfPDFPage(imageAsStream, data.getOriginalFileName(), 0);

                    //Convert pdf image back to bytes
                    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                    ImageIO.write(image, "jpg", outputStream);
                    outputStream.flush();
                    byte[] pdfImageAsBytes = outputStream.toByteArray();
                    outputStream.close();

                    data.setReceiptFullImage(pdfImageAsBytes);
                    data.setReceiptPDF(imageAsBytes);
                } else {
                    image = ImageIO.read(imageAsStream);
                    data.setReceiptFullImage(imageAsBytes);
                }

                //Create byte array for thumbnail
                long startTime = System.nanoTime();
                data.setReceiptThumbnail(ImageThumbnailCreator.createThumbnail(image, ReceiptController.THUMBNAIL_HEIGHT, ReceiptController.THUMBNAIL_MAX_WIDTH));
                long endTime = System.nanoTime();
                long duration = (endTime - startTime) / 1000000;
                logger.debug("Time to scale receipt image of size: " + imageAsBytes.length + " into a thumbnail: " + duration + "ms");

                //TODO Update data var with receipt id and any other important info.
                //Send receipt to database and get receiptId for user editing of OCR initialized values
                data.setReceiptId(this.receiptDao.addReceipt(user.getUsername(), data));

                success = true;
            } catch (DataAccessException e) {
                logger.error("User: " + user.getUsername() + " failed to upload file: " + receiptImage.getOriginalFilename());
                logger.error("Error description: " + e.getMessage());
                throw e;
            } catch (IOException iox) {
                logger.error("Failed to convert user: " + user.getUsername() + " image for storage on database.");
                throw new RuntimeException(iox.getMessage());
            }
        } else {
            logger.info("User: " + user.getUsername() + " attempted to upload empty file.");
            errorMsg = "Receipt image is required.";
        }

        response.setSuccess(success);
        response.setErrorMessage(errorMsg);
        response.setData(data);

        return response;
    }

    private static LogoAndDocumentResponse doOCR(byte[] image) throws Exception {
        LogoAndDocumentResponse retVal = null;

        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {

            ByteString imgBytes = ByteString.copyFrom(image);

            // Builds the image annotation request
            List<AnnotateImageRequest> requests = new ArrayList<>();
            Image img = Image.newBuilder().setContent(imgBytes).build();
            Feature docFeat = Feature.newBuilder().setType(Feature.Type.DOCUMENT_TEXT_DETECTION).build();
            AnnotateImageRequest docRequest = AnnotateImageRequest.newBuilder()
                    .addFeatures(docFeat)
                    .setImage(img)
                    .build();
            Feature lblFeat = Feature.newBuilder().setType(Feature.Type.LOGO_DETECTION).build();
            AnnotateImageRequest lblRequest = AnnotateImageRequest.newBuilder()
                    .addFeatures(lblFeat)
                    .setImage(img)
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

                //Return top logo result and document text.
                List<EntityAnnotation> logoAnnotations = res.getLogoAnnotationsList();
                if (res.hasFullTextAnnotation()) {
                    TextAnnotation annotation = res.getFullTextAnnotation();
                    retVal.setDocumentText(annotation.getText().substring(0, MAX_DESCRIPTION_LENGTH));
                } else if (logoAnnotations.size() != 0) {
                    retVal.setLogoDescription(logoAnnotations.get(0).getDescription());
                }
            }
        }

        return retVal;
    }

}
