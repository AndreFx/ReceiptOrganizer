package com.afx.web.receiptorganizer.receipts;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.dao.receipt.ReceiptDao;
import com.afx.web.receiptorganizer.receipts.responses.VisionJsonResponse;
import com.afx.web.receiptorganizer.receipts.types.LogoAndDocumentResponse;
import com.afx.web.receiptorganizer.types.*;
import com.afx.web.receiptorganizer.exceptions.types.ReceiptNotFoundException;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.receipts.validators.ReceiptValidator;
import com.afx.web.receiptorganizer.utilities.ImageThumbnailCreator;
import com.afx.web.receiptorganizer.utilities.PDFImageCreator;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.dao.DataAccessException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.*;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("receipts")
@SessionAttributes(value={"user"})
public class ReceiptController {

    /*
    Constants
     */

    private static final int MAX_ACTIVE_LABELS = 5;
    private static final int MAX_RECEIPT_THUMBNAIL_ITEMS = 1;
    private static final int THUMBNAIL_HEIGHT = 84;
    private static final int THUMBNAIL_MAX_WIDTH = 175;
    private static final int MAX_DESCRIPTION_LENGTH = 500;

    /*
    Private static variables
     */

    private static Logger logger = LogManager.getLogger(ReceiptController.class);

    /*
    Private fields
     */

    @Autowired
    private ReceiptDao receiptDao;

    @Autowired
    private LabelDao labelDao;

    @Autowired
    private ReceiptValidator receiptValidator;

    /*
    Binding methods
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
    Controller methods
     */

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index(@RequestParam(value = "searchString", required = false) String searchString, @RequestParam(value = "requestLabels", required = false) List<String> requestLabels, @RequestParam(value = "page", required = false) Integer page,
                           @ModelAttribute("user") User user, ModelMap model) {
        logger.debug("Serving user: " + user.getUsername() + " request for home screen.");

        List<Receipt> receipts = null;
        int totalNumReceipts;

        if (requestLabels == null) {
            requestLabels = new ArrayList<>();
        } else if (requestLabels.size() > MAX_ACTIVE_LABELS) {
            //TODO Send user message about max number of active labels
            requestLabels.remove(MAX_ACTIVE_LABELS);
        }

        if (searchString != null) {
            StringBuilder temp = new StringBuilder(searchString);
            temp.insert(0, '%');
            temp.append('%');
            totalNumReceipts = this.receiptDao.getTotalNumUserReceiptsFromString(user.getUsername(), temp.toString());

            if (page == null || page < 1 || page > Math.ceil(totalNumReceipts / (float) user.getPaginationSize())) {
                page = 1;
            }
            if (totalNumReceipts != 0) {
                receipts = this.receiptDao.findRangeUserReceiptsFromString(user.getUsername(),
                        temp.toString(), user.getPaginationSize() * (page - 1), user.getPaginationSize());
            }
        } else {
            searchString = "";
            totalNumReceipts = this.receiptDao.getTotalNumUserReceiptsForLabels(user.getUsername(), requestLabels);

            if (page == null || page < 1 || page > Math.ceil(totalNumReceipts / (float) user.getPaginationSize())) {
                page = 1;
            }
            if (totalNumReceipts != 0) {
                receipts = this.receiptDao.getRangeUserReceiptsForLabels(user.getUsername(), requestLabels,
                        user.getPaginationSize() * (page - 1), user.getPaginationSize());
            }
        }

        //Get all user labels and receipts associated with requestLabels
        List<Label> userLabels = this.labelDao.getAllUserLabels(user.getUsername());

        model.addAttribute("userLabels", userLabels);
        model.addAttribute("receipts", receipts);
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());
        model.addAttribute("activeLabels", requestLabels);
        model.addAttribute("searchString", "");
        model.addAttribute("numPages", Math.ceil(totalNumReceipts / (float) user.getPaginationSize()));
        model.addAttribute("currentPage", page);
        model.addAttribute("pageSize", user.getPaginationSize());
        model.addAttribute("numThumbnailItems", MAX_RECEIPT_THUMBNAIL_ITEMS);
        model.addAttribute("numReceipts", totalNumReceipts);
        model.addAttribute("searchString", searchString);

        return "receipts";
    }

    @RequestMapping(value = "/{receiptId}", method = RequestMethod.GET)
    public String show(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user, ModelMap model) {
        logger.debug("User: " + user.getUsername() + " viewing receipt with id: " + id);
        List<Label> labels = this.labelDao.getAllUserLabels(user.getUsername());
        Receipt receipt = this.receiptDao.getReceipt(user.getUsername(), id);
        if (receipt == null) {
            throw new ReceiptNotFoundException(id);
        }

        model.addAttribute("userLabels", labels);
        model.addAttribute("receipt", receipt);
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());
        model.addAttribute("receiptId", id);

        return "receipt-view";
    }

    @RequestMapping(value = "/{receiptId}/image", method = RequestMethod.GET)
    public void getImage(@PathVariable(value = "receiptId") int id,
                                @RequestParam("thumbnail") boolean scale,
                                @ModelAttribute("user") User user,
                                HttpServletResponse response) {
        logger.debug("User: " + user.getUsername() + " requesting image for receipt: " + id);

        try {
            ReceiptFile receiptImage;
            InputStream in;

            if (scale) {
                receiptImage = this.receiptDao.getReceiptImage(user.getUsername(), id, true);
            } else {
                receiptImage = this.receiptDao.getReceiptImage(user.getUsername(), id, false);
            }

            in = new ByteArrayInputStream(receiptImage.getReceiptFile());
            response.setContentType(receiptImage.getMIME());
            response.setHeader("content-Disposition", "inline; filename=" + id + "image.jpeg");
            response.setContentLength(receiptImage.getReceiptFile().length);
            IOUtils.copy(in, response.getOutputStream());
            response.flushBuffer();
            in.close();
        } catch(IOException e) {
            logger.error("Unable to send image id: " + id + " response to user: " + user.getUsername());
        }
    }

    @RequestMapping(value = "/{receiptId}/file", method = RequestMethod.GET)
    public void getFile(@PathVariable(value = "receiptId") int id,
                                @ModelAttribute("user") User user,
                                HttpServletResponse response) {
        logger.debug("User: " + user.getUsername() + " requesting file for receipt: " + id);

        try {
            InputStream in;
            ReceiptFile receiptFile = this.receiptDao.getReceiptFile(user.getUsername(), id);

            in = new ByteArrayInputStream(receiptFile.getReceiptFile());

            String s = "content-Disposition";
            if (!receiptFile.getMIME().equals("application/pdf")) {
                response.setContentType(receiptFile.getMIME());
                response.setHeader(s, "inline; filename=" + id + "image.jpeg");
            } else {
                response.setContentType(receiptFile.getMIME());
                response.setHeader(s, "inline; filename=" + id + "file.pdf");
            }

            response.setContentLength(receiptFile.getReceiptFile().length);
            IOUtils.copy(in, response.getOutputStream());
            response.flushBuffer();
            in.close();
        } catch(IOException e) {
            logger.error("Unable to send image id: " + id + " response to user: " + user.getUsername());
        }
    }

    @RequestMapping(value = "/{receiptId}", method = RequestMethod.POST)
    public String update(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user, @ModelAttribute("receipt") Receipt receipt) {
        logger.debug("User: " + user.getUsername() + " updating receipt with id: " + id);
        receipt.setReceiptId(id);

        try {
            //Remove invalid receipt item entries
            receipt.removeInvalidReceiptItems();

            this.receiptDao.editReceipt(user.getUsername(), receipt);

            logger.debug("User: " + user.getUsername() + " successfully updated receipt: " + id);
        } catch (DataAccessException e) {
            logger.error("Error description: " + e.getMessage());
            throw new ReceiptNotFoundException(id);
        }

        return "redirect:/home/";
    }

    @RequestMapping(value = "/{receiptId}/delete", method = RequestMethod.POST)
    public String delete(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user) {
        logger.debug("User: " + user.getUsername() + " deleting receipt with id: " + id);

        this.receiptDao.deleteReceipt(user.getUsername(), id);

        return "redirect:/home/";
    }

    @RequestMapping(value = "/", produces={MediaType.APPLICATION_JSON_VALUE}, method = RequestMethod.POST)
    @ResponseBody
    public VisionJsonResponse create(@RequestParam("receiptImage") MultipartFile receiptImage, @ModelAttribute("user") User user) throws Exception {
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
            //TODO Add button to skip ocr
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

    /*
    Private static utility methods
     */

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
                    if (annotation.getText().length() > 500) {
                        retVal.setDocumentText(annotation.getText().substring(0, MAX_DESCRIPTION_LENGTH));
                    } else {
                        retVal.setDocumentText(annotation.getText());
                    }
                } else if (logoAnnotations.size() != 0) {
                    retVal.setLogoDescription(logoAnnotations.get(0).getDescription());
                }
            }
        }

        return retVal;
    }

}
