package com.afx.web.receiptorganizer.receipts.types.requests;

import javax.validation.Valid;

import com.afx.web.receiptorganizer.types.Receipt;

public class CreateReceiptRequest {

    /*
    Private fields
     */

    @Valid
    private Receipt receipt;
    private boolean skipOCR;

    /*
    Getters and setters
     */

    public Receipt getReceipt() {
        return receipt;
    }

    public void setReceipt(Receipt receipt) {
        this.receipt = receipt;
    }

    public boolean getSkipOCR() {
        return skipOCR;
    }

    public void setSkipOCR(boolean skipOCR) {
        this.skipOCR = skipOCR;
    }
}