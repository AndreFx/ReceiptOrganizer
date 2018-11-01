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
import javax.servlet.http.HttpServletResponse;

import com.afx.web.receiptorganizer.dao.receipt.ReceiptDao;
import com.afx.web.receiptorganizer.receipts.types.LogoAndDocumentResponse;
import com.afx.web.receiptorganizer.receipts.types.receiptparsers.ReceiptParser;
import com.afx.web.receiptorganizer.receipts.types.receiptparsers.factories.ReceiptParserFactory;
import com.afx.web.receiptorganizer.receipts.types.requests.CreateReceiptRequest;
import com.afx.web.receiptorganizer.receipts.types.responses.ReceiptResponse;
import com.afx.web.receiptorganizer.receipts.types.responses.ReceiptsPage;
import com.afx.web.receiptorganizer.receipts.types.responses.VisionResponse;
import com.afx.web.receiptorganizer.receipts.validators.ReceiptValidator;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.ReceiptFile;
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

import org.apache.commons.io.IOUtils;
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
    public ReceiptsPage index(@ModelAttribute("user") User user, 
            Locale locale,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) List<String> activeLabelNames,
            @RequestParam(required = false) Integer pageNum) {
        logger.debug("Serving user: " + user.getUsername() + " request for receipts");

        if (activeLabelNames == null) {
            activeLabelNames = new ArrayList<String>();
        }
        if (query == null) {
            query = "";
        }
        if (pageNum == null || pageNum < 1) {
            pageNum = 0;
        }

        ReceiptsPage response = this.receiptDao.getRangeUserReceipts(user.getUsername(), query, activeLabelNames, user.getPaginationSize() * pageNum, user.getPaginationSize());

        response.setReceipts(response.getReceipts());
        response.setSuccess(true);
        response.setMessage(messageSource.getMessage("receipt.index.success", null, locale));
        response.setNumPages(response.getTotalNumReceipts() == null ? 0 : (int) Math.ceil(response.getTotalNumReceipts() / (float) user.getPaginationSize()));

        return response;
    }

    @RequestMapping(value = "/{receiptId}", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.GET)
    public ReceiptResponse show(@ModelAttribute("user") User user, Locale locale, @PathVariable(value = "receiptId") int id) {
        logger.debug("User: " + user.getUsername() + " requesting receipt with id: " + id);
        ReceiptResponse response = new ReceiptResponse();
        Receipt receipt = this.receiptDao.getReceipt(user.getUsername(), id);
        if (receipt == null) {
            response.setSuccess(false);
            response.setMessage(messageSource.getMessage("receipt.show.failure", null, locale));
        } else {
            response.setReceipt(receipt);
            response.setSuccess(true);
            response.setMessage(messageSource.getMessage("receipt.show.success", null, locale));
        }

        return response;
    }

    @RequestMapping(value = "/{receiptId}/file/{fileName}", method = RequestMethod.GET)
    public void file(HttpServletResponse response, @ModelAttribute("user") User user, Locale locale, @PathVariable(value = "receiptId") int id, @PathVariable(value = "fileName") String fileName) {
        logger.debug("User: " + user.getUsername() + " requesting file for receipt with id: " + id);

        try {
            ReceiptFile receiptFile = new ReceiptFile();
            InputStream in;
            int length = 0;
            receiptFile = this.receiptDao.getReceiptFile(user.getUsername(), id);
    
            //Validate request for fileName until (if) multiple files are implemented
            if (!fileName.equals(receiptFile.getFileName())) {
                throw new Exception();
            }

            if (receiptFile.getOriginalMIME() != null) {
                in = new ByteArrayInputStream(receiptFile.getOriginalFile());
                length = receiptFile.getOriginalFile().length;
                response.setContentType(receiptFile.getOriginalMIME());
            } else {
                in = new ByteArrayInputStream(receiptFile.getFile());
                length = receiptFile.getFile().length;
                response.setContentType(receiptFile.getMIME());
            }
            response.setHeader("content-Disposition", "inline; filename=" + id + "image.jpeg");
            response.setContentLength(length);
            IOUtils.copy(in, response.getOutputStream());
            response.flushBuffer();
            in.close();
        } catch (IOException e) {
            logger.error("Unable to send file id: " + id + " to user: " + user.getUsername());
        } catch (Exception e) {
            logger.error("Client submitted request for invalid filename: " + fileName + " for id: " + id + "for user: " + user.getUsername());
        }
    }

    @RequestMapping(value = "/{receiptId}/thumbnail", method = RequestMethod.GET)
    public void thumbnail(HttpServletResponse response, @ModelAttribute("user") User user, Locale locale, @PathVariable(value = "receiptId") int id) {
        logger.debug("User: " + user.getUsername() + " requesting thumbnail for receipt with id: " + id);

        try {
            ReceiptFile receiptFile = new ReceiptFile();
            InputStream in;
            receiptFile = this.receiptDao.getReceiptFile(user.getUsername(), id);
    
            in = new ByteArrayInputStream(receiptFile.getThumbnail());    
            response.setContentType(receiptFile.getThumbnailMIME());    
            response.setHeader("content-Disposition", "inline; filename=" + id + "image.jpeg");
            response.setContentLength(receiptFile.getThumbnail().length);
            IOUtils.copy(in, response.getOutputStream());
            response.flushBuffer();
            in.close();
        } catch (IOException e) {
            logger.error("Unable to send file id: " + id + " to user: " + user.getUsername());
        }
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
                InputStream imageAsStream = new ByteArrayInputStream(receipt.getFile());
                BufferedImage image = PDFImageCreator.createImageOfPDFPage(imageAsStream, data.getFileName(), 0);

                // Convert pdf image back to bytes
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                ImageIO.write(image, "jpg", outputStream);
                outputStream.flush();
                byte[] pdfImageAsBytes = outputStream.toByteArray();
                outputStream.close();

                data.setOriginalFile(receipt.getFile());
                data.setOriginalMIME("application/pdf");
                data.setMIME("image/jpeg");
                data.setFile(pdfImageAsBytes);

                // Create byte array for thumbnail
                data.setThumbnail(ImageThumbnailCreator.createThumbnail(image, THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH));
                data.setThumbnailMIME("image/jpeg");
            } else {
                // Skip ocr selected on nonpdf file
                data = new Receipt();
                InputStream imageAsStream = new ByteArrayInputStream(receipt.getFile());
                BufferedImage image = ImageIO.read(imageAsStream);

                data.setFile(receipt.getFile());
                data.setThumbnail(ImageThumbnailCreator.createThumbnail(image, THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH));
                data.setThumbnailMIME("image/jpeg");
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
