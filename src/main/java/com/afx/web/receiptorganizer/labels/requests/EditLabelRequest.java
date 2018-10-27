package com.afx.web.receiptorganizer.labels.requests;

import com.afx.web.receiptorganizer.types.Label;

public class EditLabelRequest {

    /*
    Private fields
     */

    private Label newLabel;
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