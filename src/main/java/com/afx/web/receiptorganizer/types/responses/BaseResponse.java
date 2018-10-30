package com.afx.web.receiptorganizer.types.responses;

public class BaseResponse {

    /*
     * Private fields
     */

    private boolean success;
    private String message;

    /*
     * Constructor
     */

    public BaseResponse() {
        
    }

    public BaseResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    /*
     * Getters and setters
     */

    public boolean getSuccess() {
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
}
