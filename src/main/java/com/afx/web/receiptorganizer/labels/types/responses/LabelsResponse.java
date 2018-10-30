package com.afx.web.receiptorganizer.labels.types.responses;

import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.responses.BaseResponse;

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