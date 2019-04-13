package com.afx.web.receiptorganizer.rest.model.response.label;

import com.afx.web.receiptorganizer.dao.model.label.Label;
import com.afx.web.receiptorganizer.rest.model.response.BaseResponse;

import java.util.List;

public class LabelsResponse extends BaseResponse {

    /*
    Private fields
     */

    private List<Label> labels;

    /*
    Getters and setters
     */

    public List<Label> getLabels() {
        return labels;
    }

    public void setLabels(List<Label> labels) {
        this.labels = labels;
    }
}