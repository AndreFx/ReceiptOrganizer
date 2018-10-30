package com.afx.web.receiptorganizer.receipts.types.responses;

import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.responses.BaseResponse;

public class ReceiptResponse extends BaseResponse {

    /*
     * Private fields
     */

    private Receipt receipt;

    /*
     * Getters and setters
     */

    public Receipt getReceipts() {
        return receipt;
    }

    public void setReceipts(Receipt receipt) {
        this.receipt = receipt;
    }
}