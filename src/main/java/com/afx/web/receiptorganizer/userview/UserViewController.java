package com.afx.web.receiptorganizer.userview;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.dao.receipt.ReceiptDao;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.PagedListHolder;
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
}
