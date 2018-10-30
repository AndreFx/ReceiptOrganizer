package com.afx.web.receiptorganizer.receipts;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.imageio.ImageIO;

import com.afx.web.receiptorganizer.dao.receipt.ReceiptDao;
import com.afx.web.receiptorganizer.receipts.types.LogoAndDocumentResponse;
import com.afx.web.receiptorganizer.receipts.types.receiptparsers.ReceiptParser;
import com.afx.web.receiptorganizer.receipts.types.receiptparsers.factories.ReceiptParserFactory;
import com.afx.web.receiptorganizer.receipts.types.requests.CreateReceiptRequest;
import com.afx.web.receiptorganizer.receipts.types.responses.ReceiptResponse;
import com.afx.web.receiptorganizer.receipts.types.responses.ReceiptsResponse;
import com.afx.web.receiptorganizer.receipts.types.responses.VisionResponse;
import com.afx.web.receiptorganizer.receipts.validators.ReceiptValidator;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.User;
import com.afx.web.receiptorganizer.types.responses.BaseResponse;
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
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataAccessException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

@RestController
@RequestMapping("receipts")
@SessionAttributes(value = { "user" })
public class ReceiptController {

    /*
     * Constants
     */

    @Value("${receipts.maxThumbnailItems}")
    private int MAX_RECEIPT_THUMBNAIL_ITEMS;
    @Value("${receipts.thumbnailHeight}")
    private int THUMBNAIL_HEIGHT;
    @Value("${receipts.thumbnailWidth}")
    private int THUMBNAIL_WIDTH;

    /*
     * Private static variables
     */

    private static Logger logger = LogManager.getLogger(ReceiptController.class);

    /*
     * Private fields
     */

    @Autowired
    private ReceiptDao receiptDao;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ReceiptValidator receiptValidator;

    @Autowired
    private ReceiptParserFactory receiptParserFactory;

    /*
     * Binding methods
     */

    @InitBinder("newReceipt")
    public void newReceiptInitBinder(WebDataBinder binder) {
        binder.addValidators(receiptValidator);
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

    @InitBinder("receipt")
    public void receiptEditInitBinder(WebDataBinder binder) {
        binder.addValidators(receiptValidator);
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

    /*
     * Controller methods
     */
    @RequestMapping(value = "/", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.GET)
    public ReceiptsResponse index(@ModelAttribute("user") User user, 
            Locale locale,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) List<String> activeLabelNames,
            @RequestParam(required = false) Integer pageNum) {
        logger.debug("Serving user: " + user.getUsername() + " request for receipts");
        ReceiptsResponse response = new ReceiptsResponse();
        List<Receipt> receipts = null;
        int totalNumReceipts;

        if (activeLabelNames == null) {
            activeLabelNames = new ArrayList<String>();
        }

        //TODO: Combine these two. We should be searching with both at the same time
        if (query != null) {
            StringBuilder temp = new StringBuilder(query);
            temp.insert(0, '%');
            temp.append('%');
            totalNumReceipts = this.receiptDao.getTotalNumUserReceiptsFromString(user.getUsername(), temp.toString());

            if (pageNum == null || pageNum < 1 || pageNum > Math.ceil(totalNumReceipts / (float) user.getPaginationSize())) {
                pageNum = 1;
            }
            if (totalNumReceipts != 0) {
                receipts = this.receiptDao.findRangeUserReceiptsFromString(user.getUsername(), temp.toString(),
                        user.getPaginationSize() * (pageNum - 1), user.getPaginationSize());
            }
        } else {
            query = "";
            totalNumReceipts = this.receiptDao.getTotalNumUserReceiptsForLabels(user.getUsername(), activeLabelNames);

            if (pageNum == null || pageNum < 1 || pageNum > Math.ceil(totalNumReceipts / (float) user.getPaginationSize())) {
                pageNum = 1;
            }
            if (totalNumReceipts != 0) {
                receipts = this.receiptDao.getRangeUserReceiptsForLabels(user.getUsername(), activeLabelNames,
                        user.getPaginationSize() * (pageNum - 1), user.getPaginationSize());
            }
        }

        response.setReceipts(receipts);
        response.setSuccess(true);
        response.setMessage(messageSource.getMessage("receipt.index.success", null, locale));
        response.setNumPages((int) Math.ceil(totalNumReceipts / (float) user.getPaginationSize()));
        response.setTotalNumReceipts(totalNumReceipts);

        return response;
    }

    @RequestMapping(value = "/{receiptId}", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.GET)
    public ReceiptResponse get(@ModelAttribute("user") User user, Locale locale, @PathVariable(value = "receiptId") int id) {
        logger.debug("User: " + user.getUsername() + " requesting receipt with id: " + id);
        ReceiptResponse response = new ReceiptResponse();
        Receipt receipt = this.receiptDao.getReceipt(user.getUsername(), id);
        if (receipt == null) {
            response.setSuccess(false);
            response.setMessage(messageSource.getMessage("receipt.show.failure", null, locale));
        } else {
            response.setSuccess(true);
            response.setMessage(messageSource.getMessage("receipt.show.success", null, locale));
        }

        return response;
    }

    @RequestMapping(value = "/{receiptId}/edit", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.POST)
    public BaseResponse update(@ModelAttribute("user") User user, Locale locale, @PathVariable(value = "receiptId") int id, @RequestBody Receipt updatedReceipt) {
        logger.debug("User: " + user.getUsername() + " updating receipt with id: " + id);
        boolean success = false;
        String message = "";

        if (updatedReceipt.getId() != id) {
            try {
                this.receiptDao.editReceipt(user.getUsername(), updatedReceipt);
    
                success = true;
                message = messageSource.getMessage("receipt.edit.success", null, locale);
                logger.debug("User: " + user.getUsername() + " successfully updated receipt: " + id);
            } catch (DataAccessException e) {
                logger.error("Error description: " + e.getMessage());
                message = messageSource.getMessage("receipt.edit.failure", null, locale);
            }
        } else {
            message = messageSource.getMessage("receipt.edit.failure.invalidid", null, locale);
        }

        return new BaseResponse(success, message);
    }

    @RequestMapping(value = "/{receiptId}/delete", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.POST)
    public BaseResponse delete(@ModelAttribute("user") User user, Locale locale, @PathVariable(value = "receiptId") int id) {
        logger.debug("User: " + user.getUsername() + " deleting receipt with id: " + id);

        this.receiptDao.deleteReceipt(user.getUsername(), id);

        return new BaseResponse(true, messageSource.getMessage("receipt.delete.success", null, locale));
    }

    @RequestMapping(value = "/create", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.POST)
    public VisionResponse create(@ModelAttribute("user") User user, Locale locale, @RequestBody CreateReceiptRequest request) throws Exception {
        Receipt receipt = request.getReceipt();
        logger.debug("User: " + user.getUsername() + " performing OCR on file: " + receipt.getFileName());

        VisionResponse response = new VisionResponse();
        boolean success = false;
        String message = "";
        Receipt data = null;

        if (receipt.getFile().length != 0) {

            if (receipt.getMIME() != null && !receipt.getMIME().equals("application/pdf") && request.getSkipOCR() == false) {
                LogoAndDocumentResponse ocrResponse = doOCR(receipt.getFile());
                try {
                    ReceiptParser parser = this.receiptParserFactory.getReceiptParser(ocrResponse.getLogoDescription());
                    data = parser.parseReceipt(receipt, ocrResponse);
                } catch (IOException iox) {
                    logger.error("Failed to convert user: " + user.getUsername() + " image for storage on database.");
                    throw new RuntimeException(iox.getMessage());
                }
            } else if (receipt.getMIME() != null && receipt.getMIME().equals("application/pdf")) {
                message = messageSource.getMessage("receipt.create.pdf", null, locale);
                // Setup receipt
                data = new Receipt();
                BufferedImage image;
                InputStream imageAsStream = new ByteArrayInputStream(receipt.getFile());
                image = PDFImageCreator.createImageOfPDFPage(imageAsStream, data.getFileName(), 0);

                // Convert pdf image back to bytes
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                ImageIO.write(image, "jpg", outputStream);
                outputStream.flush();
                byte[] pdfImageAsBytes = outputStream.toByteArray();
                outputStream.close();

                data.setOriginalFile(receipt.getFile());
                data.setFile(pdfImageAsBytes);

                // Create byte array for thumbnail
                data.setThumbnail(ImageThumbnailCreator.createThumbnail(image, THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH));
            } else {
                // Skip ocr selected on nonpdf file
                data = new Receipt();
                BufferedImage image;
                InputStream imageAsStream = new ByteArrayInputStream(receipt.getFile());

                image = ImageIO.read(imageAsStream);
                data.setFile(receipt.getFile());
                data.setThumbnail(ImageThumbnailCreator.createThumbnail(image, THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH));
            }

            data.setId(this.receiptDao.addReceipt(user.getUsername(), data));
            success = true;
        } else {
            logger.info("User: " + user.getUsername() + " attempted to upload empty file.");
            message = messageSource.getMessage("receipt.create.failure.nofile", null, locale);;
        }

        response.setSuccess(success);
        response.setMessage(message);
        response.setNewReceipt(data);

        return response;
    }

    /*
     * Private static utility methods
     */

    private static LogoAndDocumentResponse doOCR(byte[] image) throws Exception {
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
