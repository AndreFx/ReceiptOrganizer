package com.afx.web.receiptorganizer.labels.types.requests;

import javax.validation.Valid;

import com.afx.web.receiptorganizer.types.Label;

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