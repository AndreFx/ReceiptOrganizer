package com.afx.web.receiptorganizer.labels.responses;

public class LabelJsonResponse {

    /*
    Private fields
     */

    private boolean success;
    private String errorMessage;

    /*
    Getters and setters
     */

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
