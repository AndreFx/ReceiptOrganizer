package com.afx.web.receiptorganizer.rest.model.response.receipt;

import com.afx.web.receiptorganizer.dao.model.receipt.Receipt;
import com.afx.web.receiptorganizer.rest.model.response.BaseResponse;

import java.util.List;

public class ReceiptPage extends BaseResponse {

    /*
     * Private fields
     */

    private List<Receipt> receipts;
    private Integer numPages;
    private Integer totalNumReceipts;

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
}
