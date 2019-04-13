package com.afx.web.receiptorganizer.service.label;

import java.util.List;

import com.afx.web.receiptorganizer.dao.model.label.Label;

public interface LabelService {

    void addLabel(String username, Label label);

    void deleteLabel(String username, Label label);

    void editLabel(String username, Label oldLabel, Label newLabel);

    List<Label> getAllLabels(String username);

    boolean isLabelUnique(String username, Label label);

}