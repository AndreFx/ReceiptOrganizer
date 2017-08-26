package com.afx.web.receiptorganizer.home;

import com.afx.web.receiptorganizer.home.dao.LabelDao;
import com.afx.web.receiptorganizer.home.dao.ReceiptDao;
import com.afx.web.receiptorganizer.home.types.Label;
import com.afx.web.receiptorganizer.home.types.Receipt;
import com.afx.web.receiptorganizer.login.types.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
@RequestMapping("home")
@SessionAttributes("user")
public class HomeController {

    private static Logger logger = LogManager.getLogger(HomeController.class);

    @Autowired
    private LabelDao labelDao;

    @Autowired
    private ReceiptDao receiptDao;

    @Autowired
    private MessageSource messageSource;

    @InitBinder("newReceipt")
    public void receiptInitBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));

        //Unneeded for validation. Using jquery on client
        //binder.setValidator(new ReceiptValidator());
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String initForm(@RequestParam(value = "label", required = false) String label, @RequestParam(value = "page", required = false) Integer page,
                           @ModelAttribute("user") User user, ModelMap model) {
        logger.debug("Serving user request for home screen.");

        //All user labels
        List<Label> labels = labelDao.getAllUserLabels(user.getUsername());
        List<Receipt> receipts = receiptDao.getUserReceiptsForLabel(user.getUsername(), label);

        PagedListHolder<Receipt> pagedReceipts = new PagedListHolder<>(receipts);
        //TODO Allow this to be customized by user
        pagedReceipts.setPageSize(10);

        if (page == null || page < 1 || page > pagedReceipts.getPageCount()) {
            //Default to page 1 when input is invalid.
            page = 1;
            pagedReceipts.setPage(0);
        } else {
            pagedReceipts.setPage(page - 1);
        }

        model.addAttribute("labels", labels);
        model.addAttribute("receipts", pagedReceipts.getPageList());
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());
        model.addAttribute("currentLabel", label);
        model.addAttribute("numPages", pagedReceipts.getPageCount());
        model.addAttribute("currentPage", page);
        model.addAttribute("pageSize", pagedReceipts.getPageSize());
        model.addAttribute("numReceipts", receipts.size());


        return "home";
    }

    @RequestMapping(value = "/createlabel.do", method = RequestMethod.POST)
    public String createLabel(@ModelAttribute("user") User user, @ModelAttribute Label newLabel, RedirectAttributes ra) {
        this.labelDao.addLabel(user.getUsername(), newLabel);

        return "redirect:/home/";
    }

    @RequestMapping(value = "/getreceipts.do", method = RequestMethod.POST)
    String loadLabelReceipts(@ModelAttribute("user") User user, @RequestAttribute("label") String label) {


        return "redirect:/home/";
    }

//    //Example ajax validation
//    @RequestMapping(value="/validatereceipt.do", produces={MediaType.APPLICATION_JSON_VALUE}, method = RequestMethod.POST)
//    @ResponseBody
//    public ReceiptJsonResponse validateReceipt(Locale locale, @ModelAttribute("newReceipt") @Valid Receipt newReceipt, BindingResult result) {
//        logger.info("Serving ajax request to validate Receipt.");
//
//        ReceiptJsonResponse response = new ReceiptJsonResponse();
//
//        if (result.hasErrors()) {
//            logger.warn("User attempted to submit invalid request, sending error messages.");
//            Map<String, String> errors = new HashMap<>();
//            for (FieldError error : result.getFieldErrors()) {
//                errors.put(error.getField(), messageSource.getMessage(error, locale));
//            }
//            response.setValidated(false);
//            response.setErrorMessages(errors);
//        } else {
//            logger.info("User submitted valid request to create new receipt.");
//            response.setValidated(true);
//        }
//
//        return response;
//    }

    @RequestMapping(value = "/uploadreceipt.do", method = RequestMethod.POST)
    public String createReceipt(@ModelAttribute("user") User user, @ModelAttribute("newReceipt") Receipt newReceipt, RedirectAttributes ra) {

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
