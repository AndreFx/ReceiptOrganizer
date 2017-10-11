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
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;


@Controller
@RequestMapping("labels")
@SessionAttributes("user")
public class LabelController {

    private static Logger logger = LogManager.getLogger(LabelController.class);

    @Autowired
    private LabelDao labelDao;

    @RequestMapping(value="/create", produces={MediaType.APPLICATION_JSON_VALUE}, method = RequestMethod.POST)
    @ResponseBody
    public LabelJsonResponse createLabel(@ModelAttribute("user") User user, @Valid @ModelAttribute Label newLabel, BindingResult result, RedirectAttributes ra) {
        logger.debug("User: " + user.getUsername() + " creating new label: " + newLabel.getName());
        LabelJsonResponse response = new LabelJsonResponse();
        newLabel.setName(newLabel.getName().trim());

        if (!result.hasErrors()) {
            try {
                this.labelDao.addLabel(user.getUsername(), newLabel);
                response.setSuccess(true);
                logger.debug("User: " + user.getUsername() + " created new label: " + newLabel.getName());
            } catch (DataAccessException e) {
                response.setSuccess(false);
                response.setErrorMessage("Label name is not unique");
            }
        } else {
            response.setSuccess(false);
            response.setErrorMessage("Invalid label name");
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
            response.setErrorMessage("Unable to delete label. Label may not exist in database");
        }

        return response;
    }

    @RequestMapping(value="/update", produces={MediaType.APPLICATION_JSON_VALUE}, method = RequestMethod.POST)
    @ResponseBody
    public LabelJsonResponse editLabel(@ModelAttribute("user") User user, @RequestParam String oldLabelName, @RequestParam String newLabelName, RedirectAttributes ra) {
        logger.debug("User: " + user.getUsername() + " editing label from name: " + oldLabelName + " to name: " + newLabelName);

        LabelJsonResponse response = new LabelJsonResponse();
        Label newLabel = new Label();
        newLabel.setName(newLabelName.trim());

        if (!newLabel.getName().equals("") && !newLabel.getName().equals("All Receipts") && this.labelDao.isLabelUnique(user.getUsername(), newLabel)) {
            Label oldLabel = new Label();
            oldLabel.setName(oldLabelName);

            logger.debug("User submitted valid request to create new label.");
            response.setSuccess(true);
            this.labelDao.editLabel(user.getUsername(), oldLabel, newLabel);
        } else {
            response.setSuccess(false);
            response.setErrorMessage("Label name is not unique or invalid");
            logger.debug("User submitted non-unique request to create label");
        }

        return response;
    }
}
