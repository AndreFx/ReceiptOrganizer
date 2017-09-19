package com.afx.web.receiptorganizer.userview;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.dao.receipt.ReceiptDao;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
@RequestMapping("home")
@SessionAttributes(value={"user"})
public class UserViewController {

    private static Logger logger = LogManager.getLogger(UserViewController.class);

    @Autowired
    private LabelDao labelDao;

    @Autowired
    private ReceiptDao receiptDao;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String initForm(@RequestParam(value = "label", required = false) String label, @RequestParam(value = "page", required = false) Integer page,
                           @ModelAttribute("user") User user, ModelMap model) {
        logger.debug("Serving user request for home screen.");
        List<Receipt> receipts = null;

        //All user labels
        List<Label> labels = this.labelDao.getAllUserLabels(user.getUsername());
        int totalNumReceipts = this.receiptDao.getTotalNumUserReceiptsForLabel(user.getUsername(), label);
        if (page == null || page < 1 || page > Math.ceil(totalNumReceipts / (float) user.getPaginationSize())) {
            page = 1;
        }
        if (totalNumReceipts != 0) {
            receipts = this.receiptDao.getRangeUserReceiptsForLabel(user.getUsername(), label,
                    user.getPaginationSize() * (page - 1), user.getPaginationSize());
        }

        model.addAttribute("labels", labels);
        model.addAttribute("receipts", receipts);
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());
        model.addAttribute("currentLabel", label);
        model.addAttribute("searchString", null);
        model.addAttribute("numPages", Math.ceil(totalNumReceipts / (float) user.getPaginationSize()));
        model.addAttribute("currentPage", page);
        model.addAttribute("pageSize", user.getPaginationSize());
        model.addAttribute("numReceipts", totalNumReceipts);

        return "home";
    }

    @RequestMapping(value="/search", method = RequestMethod.GET)
    public String searchReceipts(@RequestParam(value = "searchString") StringBuilder searchString, @RequestParam(value = "page", required = false) Integer page,
                                 @ModelAttribute("user") User user, ModelMap model) {
        logger.debug("User sent search string: " + searchString);

        List<Receipt> receipts = null;
        StringBuilder temp = new StringBuilder(searchString);
        temp.insert(0, '%');
        temp.append('%');

        //All user labels
        List<Label> labels = this.labelDao.getAllUserLabels(user.getUsername());
        int totalNumReceipts = this.receiptDao.getTotalNumUserReceiptsFromString(user.getUsername(), temp.toString());
        if (page == null || page < 1 || page > Math.ceil(totalNumReceipts / (float) user.getPaginationSize())) {
            page = 1;
        }
        if (totalNumReceipts != 0) {
            receipts = this.receiptDao.findRangeUserReceiptsFromString(user.getUsername(),
                    temp.toString(), user.getPaginationSize() * (page - 1), user.getPaginationSize());
        }

        model.addAttribute("labels", labels);
        model.addAttribute("receipts", receipts);
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());
        model.addAttribute("currentLabel", null);
        model.addAttribute("numPages", Math.ceil(totalNumReceipts / (float) user.getPaginationSize()));
        model.addAttribute("currentPage", page);
        model.addAttribute("pageSize", user.getPaginationSize());
        model.addAttribute("numReceipts", totalNumReceipts);
        model.addAttribute("searchString", searchString);

        return "home";
    }
}
