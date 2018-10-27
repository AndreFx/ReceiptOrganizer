package com.afx.web.receiptorganizer.labels;

import java.util.Locale;

import javax.validation.Valid;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.labels.requests.EditLabelRequest;
import com.afx.web.receiptorganizer.labels.responses.GetLabelsJsonResponse;
import com.afx.web.receiptorganizer.labels.responses.LabelJsonResponse;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.User;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataAccessException;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@RestController
@RequestMapping("labels")
@SessionAttributes("user")
public class LabelController {

    /*
     * Logger
     */

    private static Logger logger = LogManager.getLogger(LabelController.class);

    /*
     * Private fields
     */

    @Autowired
    private LabelDao labelDao;

    @Autowired
    private MessageSource messageSource;

    /*
     * Controller methods
     */

    @RequestMapping(value = "/", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.GET)
    public GetLabelsJsonResponse getLabels(@ModelAttribute("user") User user, Locale locale) {
        logger.debug("User: " + user.getUsername() + " requesting their labels");
        GetLabelsJsonResponse response = new GetLabelsJsonResponse();

        try {
            response.setLabels(this.labelDao.getAllUserLabels(user.getUsername()));
            response.setSuccess(true);
            response.setMessage(messageSource.getMessage("label.fetch.success", null, locale));
            logger.debug("User: " + user.getUsername() + " fetched labels");
        } catch (DataAccessException e) {
            response.setSuccess(false);
            response.setMessage(messageSource.getMessage("label.fetch.failure", null, locale));
        }

        return response;
    }

    @RequestMapping(value = "/create", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.POST)
    public LabelJsonResponse createLabel(@ModelAttribute("user") User user, @Valid @RequestBody Label label,
            BindingResult result, Locale locale) {
        LabelJsonResponse response = new LabelJsonResponse();
        logger.debug("User: " + user.getUsername() + " creating new label: " + label.getName());
        label.setName(label.getName().trim());

        if (!result.hasErrors()) {
            try {
                this.labelDao.addLabel(user.getUsername(), label);
                response.setSuccess(true);
                response.setMessage(messageSource.getMessage("label.add.success", null, locale));
                logger.debug("User: " + user.getUsername() + " created new label: " + label.getName());
            } catch (DataAccessException e) {
                response.setSuccess(false);
                response.setMessage(messageSource.getMessage("label.add.failure.notunique", null, locale));
            }
        } else {
            response.setSuccess(false);
            response.setMessage(messageSource.getMessage("label.add.failure.invalid", null, locale));
        }

        return response;
    }

    @RequestMapping(value = "/delete", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.POST)
    public LabelJsonResponse deleteLabel(@ModelAttribute("user") User user, @Valid @RequestBody Label label,
        BindingResult result, Locale locale) {
        LabelJsonResponse response = new LabelJsonResponse();
        logger.debug("User: " + user.getUsername() + " deleting label: " + label.getName());

        if (!result.hasErrors()) {
            try {
                this.labelDao.deleteLabel(user.getUsername(), label);
                response.setSuccess(true);
                response.setMessage(messageSource.getMessage("label.delete.success", null, locale));
            } catch (DataAccessException e) {
                response.setSuccess(false);
                response.setMessage(messageSource.getMessage("label.delete.failure", null, locale));
            }
        } else {
            response.setSuccess(false);
            response.setMessage(messageSource.getMessage("label.delete.failure.invalid", null, locale));
        }
        

        return response;
    }

    @RequestMapping(value = "/update", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.POST)
    public LabelJsonResponse editLabel(@ModelAttribute("user") User user, @Valid @RequestBody EditLabelRequest request, BindingResult result, Locale locale) {
        LabelJsonResponse response = new LabelJsonResponse();

        Label newLabel = request.getNewLabel();
        Label oldLabel = request.getOldLabel();

        logger.debug("User: " + user.getUsername() + " editing label from name: " + oldLabel.getName() + " to name: "
                + newLabel.getName());
        newLabel.setName(newLabel.getName().trim());

        if (!newLabel.getName().equals("") && !newLabel.getName().equals("All Receipts")
                && this.labelDao.isLabelUnique(user.getUsername(), newLabel)) {

            logger.debug("User submitted valid request to create new label.");
            this.labelDao.editLabel(user.getUsername(), oldLabel, newLabel);
            response.setSuccess(true);
            response.setMessage(messageSource.getMessage("label.edit.success", null, locale));
        } else {
            response.setSuccess(false);
            response.setMessage(messageSource.getMessage("label.edit.failure.notunique", null, locale));
            logger.debug("User submitted non-unique request to create label");
        }

        return response;
    }
}
