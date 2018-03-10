package com.afx.web.receiptorganizer.receipts.responses;

import com.afx.web.receiptorganizer.types.Receipt;

public class VisionJsonResponse {

    /*
    Private fields
     */

    private boolean success;
    private String errorMessage;
    private Receipt data;

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

    public Receipt getData() {
        return data;
    }

    public void setData(Receipt data) {
        this.data = data;
    }
}
