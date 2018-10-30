package com.afx.web.receiptorganizer.receipts.types.responses;

import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.responses.BaseResponse;

public class VisionResponse extends BaseResponse {

    /*
    Private fields
     */

    private Receipt newReceipt;

    /*
    Getters and setters
     */

    public Receipt getNewReceipt() {
        return newReceipt;
    }

    public void setNewReceipt(Receipt newReceipt) {
        this.newReceipt = newReceipt;
    }
}
