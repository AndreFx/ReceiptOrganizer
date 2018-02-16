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

    /*
    Logger
     */

    private static Logger logger = LogManager.getLogger(UserViewController.class);

    /*
    Constants
     */
    private static final int MAX_ACTIVE_LABELS = 5;
    private static final int MAX_RECEIPT_THUMBNAIL_ITEMS = 1;

    /*
    Private fields
     */

    @Autowired
    private LabelDao labelDao;

    @Autowired
    private ReceiptDao receiptDao;

    /*
    Controller methods
     */

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String initForm(@RequestParam(value = "requestLabels", required = false) List<String> requestLabels, @RequestParam(value = "page", required = false) Integer page,
                           @ModelAttribute("user") User user, ModelMap model) {
        logger.debug("Serving user: " + user.getUsername() + " request for home screen.");
        List<Receipt> receipts = new ArrayList<>();
        if (requestLabels == null) {
            requestLabels = new ArrayList<>();
        } else if (requestLabels.size() > MAX_ACTIVE_LABELS) {
            //TODO Send user message about max number of active labels
            requestLabels.remove(MAX_ACTIVE_LABELS);
        }

        //Get all user labels and receipts associated with requestLabels
        List<Label> userLabels = this.labelDao.getAllUserLabels(user.getUsername());
        int totalNumReceipts = this.receiptDao.getTotalNumUserReceiptsForLabels(user.getUsername(), requestLabels);
        if (page == null || page < 1 || page > Math.ceil(totalNumReceipts / (float) user.getPaginationSize())) {
            page = 1;
        }
        if (totalNumReceipts != 0) {
            receipts = this.receiptDao.getRangeUserReceiptsForLabels(user.getUsername(), requestLabels,
                    user.getPaginationSize() * (page - 1), user.getPaginationSize());
        }

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

        return "home";
    }

    @RequestMapping(value="/search", method = RequestMethod.GET)
    public String searchReceipts(@RequestParam(value = "searchString") StringBuilder searchString, @RequestParam(value = "page", required = false) Integer page,
                                 @ModelAttribute("user") User user, ModelMap model) {
        logger.debug("User sent search string: " + searchString);

        List<Receipt> receipts = new ArrayList<>();
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

        model.addAttribute("userLabels", labels);
        model.addAttribute("receipts", receipts);
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());
        model.addAttribute("activeLabels", new ArrayList<String>());
        model.addAttribute("numPages", Math.ceil(totalNumReceipts / (float) user.getPaginationSize()));
        model.addAttribute("currentPage", page);
        model.addAttribute("pageSize", user.getPaginationSize());
        model.addAttribute("numThumbnailItems", MAX_RECEIPT_THUMBNAIL_ITEMS);
        model.addAttribute("numReceipts", totalNumReceipts);
        model.addAttribute("searchString", searchString);

        return "home";
    }
}
