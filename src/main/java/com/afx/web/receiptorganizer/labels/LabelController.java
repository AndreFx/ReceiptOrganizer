package com.afx.web.receiptorganizer.labels;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.User;
import com.afx.web.receiptorganizer.userview.responses.LabelJsonResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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

    @RequestMapping(value="/validate", produces={MediaType.APPLICATION_JSON_VALUE}, method = RequestMethod.POST)
    @ResponseBody
    public LabelJsonResponse validateLabel(@ModelAttribute("user") User user, @RequestParam("labelName") String labelName) {
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
