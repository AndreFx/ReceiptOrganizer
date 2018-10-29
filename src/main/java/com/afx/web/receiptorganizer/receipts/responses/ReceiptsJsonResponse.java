package com.afx.web.receiptorganizer.receipts.responses;

import com.afx.web.receiptorganizer.types.Receipt;

import java.util.List;

public class ReceiptsJsonResponse {

    /*
     * Private fields
     */

    private List<Receipt> receipts;
    private Integer numPages;
    private Integer totalNumReceipts;
    private boolean success;
    private String message;

    /*
     * Getters and setters
     */

    public List<Receipt> getReceipts() {
        return receipts;
    }

    public void setReceipts(List<Receipt> receipts) {
        this.receipts = receipts;
    }

    public Integer getNumPages() {
        return numPages;
    }

    public void setNumPages(Integer numPages) {
        this.numPages = numPages;
    }

    public Integer getTotalNumReceipts() {
        return totalNumReceipts;
    }

    public void setTotalNumReceipts(Integer totalNumReceipts) {
        this.totalNumReceipts = totalNumReceipts;
    }

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
