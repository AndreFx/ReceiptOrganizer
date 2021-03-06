package com.afx.web.receiptorganizer.rest.receipt;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletResponse;

import com.afx.web.receiptorganizer.dao.model.receipt.Receipt;
import com.afx.web.receiptorganizer.dao.model.receipt.ReceiptFile;
import com.afx.web.receiptorganizer.dao.model.user.User;
import com.afx.web.receiptorganizer.rest.model.response.BaseResponse;
import com.afx.web.receiptorganizer.rest.model.response.receipt.ReceiptPage;
import com.afx.web.receiptorganizer.rest.model.response.receipt.ReceiptResponse;
import com.afx.web.receiptorganizer.rest.model.response.receipt.VisionResponse;
import com.afx.web.receiptorganizer.rest.validator.receipt.ReceiptValidator;
import com.afx.web.receiptorganizer.service.receipt.ReceiptService;

import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("receipts")
@SessionAttributes(value = { "user" })
public class ReceiptController {

    /*
     * Private static variables
     */

    private static Logger logger = LogManager.getLogger(ReceiptController.class);

    /*
     * Private fields
     */

    @Autowired 
    private ReceiptService receiptService;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ReceiptValidator receiptValidator;

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
    public ReceiptPage index(@ModelAttribute("user") User user, 
            Locale locale,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) List<String> activeLabelNames,
            @RequestParam(required = false) Integer pageNum) {
        logger.debug("Serving user: " + user.getUsername() + " request for receipts");

        //Setup data for service
        if (activeLabelNames == null) {
            activeLabelNames = new ArrayList<String>();
        }
        if (query == null) {
            query = "";
        }
        if (pageNum == null || pageNum < 1) {
            pageNum = 0;
        }

        //Make service call
        ReceiptPage response = this.receiptService.getReceiptPage(user.getUsername(), query, activeLabelNames, user.getPaginationSize() * pageNum, user.getPaginationSize());

        //Setup response
        response.setTotalNumReceipts(response.getTotalNumReceipts() == null ? 0 : response.getTotalNumReceipts());
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
        
        Receipt receipt = this.receiptService.getReceipt(user.getUsername(), id);

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
            receiptFile = this.receiptService.getReceiptFile(user.getUsername(), id);
    
            //Validate request for fileName until (if) multiple files are implemented
            if (receiptFile != null) {
                if (!fileName.equals(receiptFile.getFileName())) {
                    throw new Exception("Invalid filename");
                }
                
                in = new ByteArrayInputStream(receiptFile.getFile());
                length = receiptFile.getFile().length;
                response.setContentType(receiptFile.getMIME());
                response.setHeader(
                    "content-Disposition", 
                    "inline; filename=" + receiptFile.getFileName() + "." +
                    receiptFile.getMIME().substring(receiptFile.getMIME().indexOf("/") + 1, receiptFile.getMIME().length()));
                response.setContentLength(length);
                IOUtils.copy(in, response.getOutputStream());
                response.flushBuffer();
                in.close();
            } else {
                throw new Exception("Unable to find any files attached to receipt: " + id);
            }
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
            receiptFile = this.receiptService.getReceiptThumbnail(user.getUsername(), id);
    
            in = new ByteArrayInputStream(receiptFile.getThumbnail());    
            response.setContentType(receiptFile.getThumbnailMIME());    
            response.setHeader(
                "content-Disposition",
                "inline; filename=" + receiptFile.getFileName() + "." +
                receiptFile.getThumbnailMIME().substring(receiptFile.getThumbnailMIME().indexOf("/") + 1, receiptFile.getThumbnailMIME().length()));
            response.setContentLength(receiptFile.getThumbnail().length);
            IOUtils.copy(in, response.getOutputStream());
            response.flushBuffer();
            in.close();
        } catch (IOException e) {
            logger.error("Unable to send image thumbnail: " + id + " to user: " + user.getUsername());
        }
    }

    @RequestMapping(value = "/{receiptId}/edit", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.POST)
    public ReceiptResponse update(@ModelAttribute("user") User user, Locale locale, @PathVariable(value = "receiptId") int id, @RequestBody Receipt updatedReceipt) {
        logger.debug("User: " + user.getUsername() + " updating receipt with id: " + id);
        boolean success = false;
        String message = "";
        Receipt finalUpdatedReceipt = null;

        if (Integer.compare(updatedReceipt.getId(), id) == 0) {
            try {
                finalUpdatedReceipt = this.receiptService.editReceipt(user.getUsername(), updatedReceipt);
    
                success = true;
                message = messageSource.getMessage("receipt.edit.success", null, locale);
                logger.debug("User: " + user.getUsername() + " successfully updated receipt: " + id);
            } catch (DataAccessException e) {
                logger.error("Error description: " + e.getMessage());
                message = messageSource.getMessage("receipt.edit.failure", null, locale);
            }
        } else {
            logger.error("Invalid id parameter with updated receipt.");
            message = messageSource.getMessage("receipt.edit.failure.invalidid", null, locale);
        }

        return new ReceiptResponse(finalUpdatedReceipt, success, message);
    }

    @RequestMapping(value = "/{receiptId}/delete", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.POST)
    public BaseResponse delete(@ModelAttribute("user") User user, Locale locale, @PathVariable(value = "receiptId") int id) {
        logger.debug("User: " + user.getUsername() + " deleting receipt with id: " + id);

        this.receiptService.deleteReceipt(user.getUsername(), id);

        return new BaseResponse(true, messageSource.getMessage("receipt.delete.success", null, locale));
    }

    @RequestMapping(value = "/create", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.POST)
    public VisionResponse create(@ModelAttribute("user") User user, Locale locale, @RequestParam("skipOcr") boolean skipOcr, @RequestParam("receiptFile") MultipartFile file) throws Exception {
        Receipt receipt = new Receipt();
        //Put multipart data into receipt
        receipt.setFile(file.getBytes());
        receipt.setMIME(file.getContentType());
        receipt.setFileName(file.getOriginalFilename());
        
        logger.debug("User: " + user.getUsername() + " performing OCR on file: " + receipt.getFileName());

        VisionResponse response = new VisionResponse();
        boolean success = false;
        String message = "";
        Receipt data = null;

        if (receipt.getFile().length != 0) {
            data = this.receiptService.addReceipt(user.getUsername(), receipt, skipOcr);
            if (receipt.getMIME() != null && receipt.getMIME().equals("application/pdf")) {
                message = messageSource.getMessage("receipt.create.pdf", null, locale);
            } else {
                message = messageSource.getMessage("receipt.create.success", null, locale);
            }

            success = true;
        } else {
            logger.info("User: " + user.getUsername() + " attempted to upload empty file.");
            message = messageSource.getMessage("receipt.create.failure.nofile", null, locale);;
        }

        data.setFile(null);
        data.setOriginalFile(null);
        data.setThumbnail(null);
        response.setSuccess(success);
        response.setMessage(message);
        response.setNewReceipt(data);

        return response;
    }
}
