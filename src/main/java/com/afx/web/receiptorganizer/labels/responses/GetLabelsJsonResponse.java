package com.afx.web.receiptorganizer.labels.responses;

import com.afx.web.receiptorganizer.types.Label;

import java.util.List;

public class GetLabelsJsonResponse {

    /*
    Private fields
     */

    private boolean success;
    private String message;
    private List<Label> labels;

    /*
    Getters and setters
     */

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Label> getLabels() {
        return labels;
    }

    public void setLabels(List<Label> labels) {
        this.labels = labels;
    }
}