package com.afx.web.receiptorganizer.labels.responses;

public class LabelJsonResponse {

    private boolean success;
    private String errorMessage;

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
