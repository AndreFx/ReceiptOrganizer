package com.afx.web.receiptorganizer.service.label;

import java.util.List;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.dao.model.label.Label;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LabelServiceV1 implements LabelService {

    /*
     * Private fields
     */

    @Autowired
    private LabelDao labelDao;

    public void addLabel(String username, Label label) {
        this.labelDao.addLabel(username, label);
    }

    public void deleteLabel(String username, Label label) {
        this.labelDao.deleteLabel(username, label);
    }

    public void editLabel(String username, Label oldLabel, Label newLabel) {
        this.labelDao.editLabel(username, oldLabel, newLabel);
    }

    public List<Label> getAllLabels(String username) {
        return this.labelDao.getAllUserLabels(username);
    }

    public boolean isLabelUnique(String username, Label label) {
        return this.labelDao.isLabelUnique(username, label);
    }
}