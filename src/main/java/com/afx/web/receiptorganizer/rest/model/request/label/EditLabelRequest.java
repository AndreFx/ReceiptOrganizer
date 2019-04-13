package com.afx.web.receiptorganizer.rest.model.request.label;

import javax.validation.Valid;

import com.afx.web.receiptorganizer.dao.model.label.Label;

public class EditLabelRequest {

    /*
    Private fields
     */

    @Valid
    private Label newLabel;
    @Valid
    private Label oldLabel;

    /*
    Getters and setters
     */

    public Label getNewLabel() {
        return newLabel;
    }

    public void setNewLabel(Label label) {
        this.newLabel = label;
    }

    public Label getOldLabel() {
        return oldLabel;
    }

    public void setOldLabel(Label label) {
        this.oldLabel = label;
    }
}