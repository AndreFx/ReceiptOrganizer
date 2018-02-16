package com.afx.web.receiptorganizer.vision;

import com.afx.web.receiptorganizer.dao.receipt.ReceiptDao;
import com.afx.web.receiptorganizer.exceptions.types.ReceiptNotFoundException;
import com.afx.web.receiptorganizer.receipts.ReceiptController;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.User;
import com.afx.web.receiptorganizer.utilities.ImageThumbnailCreator;
import com.afx.web.receiptorganizer.utilities.PDFImageCreator;
import com.afx.web.receiptorganizer.vision.responses.VisionJsonResponse;
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

            //TODO Call OCR

            //TODO Create receipt object from ocr data
            //TODO Make a method for this, it gets really long
            data = new Receipt();
            data.setMIME(receiptImage.getContentType());
            data.setOriginalFileName(receiptImage.getOriginalFilename());
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

                //TODO Send new receipt to database
                this.receiptDao.addReceipt(user.getUsername(), data);

                //TODO Update data var with receipt id and any other important info.

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

    private static void ocr(byte[] image) throws Exception {
        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {

            ByteString imgBytes = ByteString.copyFrom(image);

            // Builds the image annotation request
            List<AnnotateImageRequest> requests = new ArrayList<>();
            Image img = Image.newBuilder().setContent(imgBytes).build();
            Feature feat = Feature.newBuilder().setType(Feature.Type.DOCUMENT_TEXT_DETECTION).build();
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feat)
                    .setImage(img)
                    .build();
            requests.add(request);

            // Performs label detection on the image file
            BatchAnnotateImagesResponse response = vision.batchAnnotateImages(requests);
            List<AnnotateImageResponse> responses = response.getResponsesList();

            for (AnnotateImageResponse res : responses) {
                if (res.hasError()) {
                    System.out.printf("Error: %s\n", res.getError().getMessage());
                    return;
                }

                TextAnnotation annotation = res.getFullTextAnnotation();
                for (Page page: annotation.getPagesList()) {
                    String pageText = "";
                    for (Block block : page.getBlocksList()) {
                        String blockText = "";
                        for (Paragraph para : block.getParagraphsList()) {
                            String paraText = "";
                            for (Word word: para.getWordsList()) {
                                String wordText = "";
                                for (Symbol symbol: word.getSymbolsList()) {
                                    wordText = wordText + symbol.getText();
                                }
                                paraText = paraText + wordText;
                            }
                            // Output Example using Paragraph:
                            System.out.println("Paragraph: \n" + paraText);
                            System.out.println("Bounds: \n" + para.getBoundingBox() + "\n");
                            blockText = blockText + paraText;
                        }
                        pageText = pageText + blockText;
                    }
                }
                System.out.println(annotation.getText());
            }
        }
    }

}
