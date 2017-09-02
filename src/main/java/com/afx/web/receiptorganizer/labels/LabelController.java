package com.afx.web.receiptorganizer.labels;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("labels")
@SessionAttributes("user")
public class LabelController {

    private static Logger logger = LogManager.getLogger(LabelController.class);

    @Autowired
    private LabelDao labelDao;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String createLabel(@ModelAttribute("user") User user, @ModelAttribute Label newLabel, RedirectAttributes ra) {
        logger.debug("User: " + user.getUsername() + " creating new label: " + newLabel.getName());
        this.labelDao.addLabel(user.getUsername(), newLabel);

        return "redirect:/home/";
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public String deleteLabel(@ModelAttribute("user") User user, @RequestParam String labelName, RedirectAttributes ra) {
        Label deleteLabel = new Label();
        deleteLabel.setName(labelName);
        this.labelDao.deleteLabel(user.getUsername(), deleteLabel);

        return "redirect:/home/";
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public String editLabel(@ModelAttribute("user") User user, @RequestParam String oldLabelName, @RequestParam String newLabelName, RedirectAttributes ra) {
        Label oldLabel = new Label();
        oldLabel.setName(oldLabelName);
        Label newLabel = new Label();
        newLabel.setName(newLabelName);
        this.labelDao.editLabel(user.getUsername(), oldLabel, newLabel);

        return "redirect:/home/";
    }

}
