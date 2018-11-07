package com.afx.web.receiptorganizer.rest.model.response.receipt;

import com.afx.web.receiptorganizer.dao.model.receipt.Receipt;
import com.afx.web.receiptorganizer.rest.model.response.BaseResponse;

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
