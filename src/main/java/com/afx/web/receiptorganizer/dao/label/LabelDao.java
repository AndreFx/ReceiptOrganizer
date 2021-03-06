package com.afx.web.receiptorganizer.dao.label;

import com.afx.web.receiptorganizer.dao.model.label.Label;

import java.util.List;

public interface LabelDao {

    void addLabel(String username, Label label);

    void deleteLabel(String username, Label label);

    void editLabel(String username, Label oldLabel, Label newLabel);

    List<Label> getAllUserLabels(String username);

    boolean isLabelUnique(String username, Label label);

}
