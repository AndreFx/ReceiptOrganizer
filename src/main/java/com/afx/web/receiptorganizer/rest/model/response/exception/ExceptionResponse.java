package com.afx.web.receiptorganizer.rest.model.response.exception;

public class ExceptionResponse {

    /*
    Private fields
     */

    private String exceptionMessage;
    private String errorMessage;

    /*
    Getters and setters
     */

    public String getExceptionMessage() {
        return exceptionMessage;
    }

    public void setExceptionMessage(String exceptionMessage) {
        this.exceptionMessage = exceptionMessage;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}