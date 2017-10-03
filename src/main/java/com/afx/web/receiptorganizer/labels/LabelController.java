package com.afx.web.receiptorganizer.labels;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.User;
import com.afx.web.receiptorganizer.labels.responses.LabelJsonResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
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

    @RequestMapping(value="/create", produces={MediaType.APPLICATION_JSON_VALUE}, method = RequestMethod.POST)
    @ResponseBody
    public LabelJsonResponse createLabel(@ModelAttribute("user") User user, @ModelAttribute Label newLabel, RedirectAttributes ra) {
        logger.debug("User: " + user.getUsername() + " creating new label: " + newLabel.getName());
        LabelJsonResponse response = new LabelJsonResponse();

        try {
            this.labelDao.addLabel(user.getUsername(), newLabel);
            response.setSuccess(true);
        } catch (DataAccessException e) {
            response.setSuccess(false);
            response.setErrorMessage("Label name is not unique.");
        }

        return response;
    }

    @RequestMapping(value="/delete", produces={MediaType.APPLICATION_JSON_VALUE}, method = RequestMethod.POST)
    @ResponseBody
    public LabelJsonResponse deleteLabel(@ModelAttribute("user") User user, @RequestParam String labelName, RedirectAttributes ra) {
        logger.debug("User: " + user.getUsername() + " deleting label: " + labelName);
        Label deleteLabel = new Label();
        deleteLabel.setName(labelName);

        LabelJsonResponse response = new LabelJsonResponse();
        try {
            this.labelDao.deleteLabel(user.getUsername(), deleteLabel);
            response.setSuccess(true);
        } catch (DataAccessException e) {
            response.setSuccess(false);
            response.setErrorMessage("Unable to delete label. Label may not exist in database.");
        }

        return response;
    }

    @RequestMapping(value="/update", produces={MediaType.APPLICATION_JSON_VALUE}, method = RequestMethod.POST)
    @ResponseBody
    public LabelJsonResponse editLabel(@ModelAttribute("user") User user, @RequestParam String oldLabelName, @RequestParam String newLabelName, RedirectAttributes ra) {
        logger.debug("User: " + user.getUsername() + " editing label from name: " + oldLabelName + " to name: " + newLabelName);
        Label oldLabel = new Label();
        oldLabel.setName(oldLabelName);
        Label newLabel = new Label();
        newLabel.setName(newLabelName);

        LabelJsonResponse response = new LabelJsonResponse();
        if (this.labelDao.isLabelUnique(user.getUsername(), newLabel)) {
            response.setSuccess(false);
            response.setErrorMessage("Label name is not unique");
            logger.debug("User submitted non-unique request to create label");
        } else {
            logger.debug("User submitted valid request to create new label.");
            response.setSuccess(true);
            this.labelDao.editLabel(user.getUsername(), oldLabel, newLabel);
        }

        return response;
    }
}
