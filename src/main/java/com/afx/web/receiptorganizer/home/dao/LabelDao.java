package com.afx.web.receiptorganizer.home.dao;

import com.afx.web.receiptorganizer.home.types.Label;

import java.util.List;

public interface LabelDao {

    void addLabel(String username, Label label);

    void deleteLabel(Label label);

    void editLabel(Label label);

    List<Label> getAllUserLabels(String username);

}
