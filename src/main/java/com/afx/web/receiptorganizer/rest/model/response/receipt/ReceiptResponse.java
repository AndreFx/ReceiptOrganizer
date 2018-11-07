package com.afx.web.receiptorganizer.rest.model.response.receipt;

import com.afx.web.receiptorganizer.dao.model.receipt.Receipt;
import com.afx.web.receiptorganizer.rest.model.response.BaseResponse;

public class ReceiptResponse extends BaseResponse {

    /*
     * Private fields
     */

    private Receipt receipt;

    /*
     * Getters and setters
     */

    public Receipt getReceipt() {
        return receipt;
    }

    public void setReceipt(Receipt receipt) {
        this.receipt = receipt;
    }
}
