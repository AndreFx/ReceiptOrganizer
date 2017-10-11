package com.afx.web.receiptorganizer.receipts;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.dao.receipt.ReceiptDao;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.exceptions.types.ReceiptNotFoundException;
import com.afx.web.receiptorganizer.types.User;
import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

//TODO Validations of Data
@Controller
@RequestMapping("receipts")
@SessionAttributes(value={"user"})
public class ReceiptController {

    private static Logger logger = LogManager.getLogger(ReceiptController.class);

    @Autowired
    private ReceiptDao receiptDao;

    @Autowired
    private LabelDao labelDao;

    @InitBinder("newReceipt")
    public void newReceiptInitBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

    @InitBinder("receipt")
    public void receiptEditInitBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

    @RequestMapping(value = "/{receiptId}", method = RequestMethod.GET)
    public String showReceipt(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user, ModelMap model) {
        logger.debug("User: " + user.getUsername() + " viewing receipt with id: " + id);
        List<Label> labels = this.labelDao.getAllUserLabels(user.getUsername());
        Receipt receipt = this.receiptDao.getReceipt(user.getUsername(), id);
        if (receipt == null) {
            throw new ReceiptNotFoundException(id);
        }

        model.addAttribute("labels", labels);
        model.addAttribute("receipt", receipt);
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());
        model.addAttribute("receiptId", id);

        return "receiptView";
    }

    @RequestMapping(value = "/{receiptId}/image", method = RequestMethod.GET)
    public void getReceiptImage(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user, HttpServletResponse response) {
        byte[] receiptImage = this.receiptDao.getReceiptImage(user.getUsername(), id);
        if (receiptImage == null) {
            throw new ReceiptNotFoundException(id);
        }

        try {
            InputStream in = new ByteArrayInputStream(receiptImage);
            response.setContentType("image/jpeg");
            response.setHeader("content-Disposition", "inline; filename=" + id + "image.jpeg");
            response.setContentLength(receiptImage.length);
            IOUtils.copy(in, response.getOutputStream());
            response.flushBuffer();
            in.close();
        } catch(IOException e) {
            logger.error("Unable to send image id: " + id + " response to user: " + user.getUsername());
        }
    }

    @RequestMapping(value = "/{receiptId}/update", method = RequestMethod.POST)
    public String updateReceipt(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user, @ModelAttribute("receipt") Receipt receipt) {
        logger.debug("User: " + user.getUsername() + " updating receipt with id: " + id);
        receipt.setReceiptId(id);

        try {
            //Create byte array for transfer to database.
            if (receipt.getMultipartFile() != null && !receipt.getMultipartFile().isEmpty()) {
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                BufferedImage image = ImageIO.read(receipt.getMultipartFile().getInputStream());
                ImageIO.write(image, "jpeg", outputStream);
                outputStream.flush();
                byte[] imageAsBytes = outputStream.toByteArray();
                outputStream.close();
                receipt.setFile(imageAsBytes);
            }

            this.receiptDao.editReceipt(user.getUsername(), receipt);

            logger.debug("User: " + user.getUsername() + " successfully uploaded image.");
        } catch (DataAccessException e) {
            logger.error("User: " + user.getUsername() + " failed to upload file: " + receipt.getMultipartFile().getName());
            logger.error("Error description: " + e.getMessage());
            throw new ReceiptNotFoundException(id);
        } catch (IOException iox) {
            logger.error("Failed to convert user: " + user.getUsername() + " image for storage on database.");
            throw new RuntimeException(iox.getMessage());
        }

        return "redirect:/home/";
    }

    @RequestMapping(value = "/{receiptId}/delete", method = RequestMethod.POST)
    public String deleteReceipt(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user) {
        logger.debug("User: " + user.getUsername() + " deleting receipt with id: " + id);
        this.receiptDao.deleteReceipt(id);

        return "redirect:/home/";
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String insertReceipt(@ModelAttribute("user") User user, @ModelAttribute("newReceipt") Receipt newReceipt, RedirectAttributes ra) {
        logger.debug("User: " + user.getUsername() + " creating new receipt with title: " + newReceipt.getTitle());

        if (newReceipt.getMultipartFile() != null && !newReceipt.getMultipartFile().isEmpty()) {
            try {
                //Create byte array for transfer to database.
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                BufferedImage image = ImageIO.read(newReceipt.getMultipartFile().getInputStream());
                ImageIO.write(image, "jpeg", outputStream);
                outputStream.flush();
                byte[] imageAsBytes = outputStream.toByteArray();
                outputStream.close();
                newReceipt.setFile(imageAsBytes);

                this.receiptDao.addReceipt(user.getUsername(), newReceipt);

                logger.debug("User: " + user.getUsername() + " successfully uploaded image.");
            } catch (DataAccessException e) {
                logger.error("User: " + user.getUsername() + " failed to upload file: " + newReceipt.getMultipartFile().getName());
                logger.error("Error description: " + e.getMessage());
                throw e;
            } catch (IOException iox) {
                logger.error("Failed to convert user: " + user.getUsername() + " image for storage on database.");
                throw new RuntimeException(iox.getMessage());
            }
        } else {
            logger.info("User: " + user.getUsername() + " attempted to upload empty file.");
        }

        return "redirect:/home/";
    }
}
