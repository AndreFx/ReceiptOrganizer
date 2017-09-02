package com.afx.web.receiptorganizer.receipts;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.dao.receipt.ReceiptDao;
import com.afx.web.receiptorganizer.userview.responses.LabelJsonResponse;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.enterprise.inject.Model;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

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
    public void receiptInitBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

    @RequestMapping(value = "/{receiptId}", method = RequestMethod.GET)
    public String showReceipt(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user, ModelMap model) {
        List<Label> labels = this.labelDao.getAllUserLabels(user.getUsername());
        Receipt showReceipt = this.receiptDao.getReceipt(user.getUsername(), id);

        model.addAttribute("labels", labels);
        model.addAttribute("receipt", showReceipt);
        model.addAttribute("newLabel", new Label());
        model.addAttribute("receiptId", id);

        return "receiptView";
    }

    @RequestMapping(value = "/{receiptId}/update", method = RequestMethod.POST)
    public String updateReceipt(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user, @ModelAttribute("receipt") Receipt receipt,
                                ModelMap model) {
        this.receiptDao.editReceipt(user.getUsername(), receipt);

        return "redirect:/home/";
    }

    @RequestMapping(value = "/{receiptId}/delete", method = RequestMethod.POST)
    public String deleteReceipt(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user, ModelMap model) {
        this.receiptDao.deleteReceipt(id);

        return "redirect:/home/";
    }

    @RequestMapping(value="/validate", produces={MediaType.APPLICATION_JSON_VALUE}, method = RequestMethod.POST)
    @ResponseBody
    public LabelJsonResponse validateReceipt(@ModelAttribute("user") User user, @RequestParam("labelName") String labelName) {
        logger.info("Serving ajax request to validate Label: " + labelName + " for user: " + user.getUsername());

        Label label = new Label();
        label.setName(labelName);
        LabelJsonResponse response = new LabelJsonResponse();

        if (this.labelDao.isLabelUnique(user.getUsername(), label)) {
            response.setValidated(false);
            logger.info("User submitted non-unique request to create label");
        } else {
            logger.info("User submitted valid request to create new label.");
            response.setValidated(true);
        }

        return response;
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String insertReceipt(@ModelAttribute("user") User user, @ModelAttribute("newReceipt") Receipt newReceipt, RedirectAttributes ra) {

        if (newReceipt.getMultipartFile() != null && !newReceipt.getMultipartFile().isEmpty()) {
            try {
                //Create byte array for transfer to database.
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                BufferedImage image = ImageIO.read(newReceipt.getMultipartFile().getInputStream());
                ImageIO.write(image, "png", outputStream);
                outputStream.flush();
                byte[] imageAsBytes = outputStream.toByteArray();
                outputStream.close();
                newReceipt.setFile(imageAsBytes);

                receiptDao.addReceipt(user.getUsername(), newReceipt);

                logger.info("User: " + user.getUsername() + " successfully uploaded image.");
            } catch (Exception e) {
                logger.error("User: " + user.getUsername() + " failed to upload file: " + newReceipt.getMultipartFile().getName());
                logger.error("Error description: " + e.getMessage());
            }
        } else {
            logger.info("User: " + user.getUsername() + " attempted to upload empty file.");
        }

        return "redirect:/home/";
    }
}
