package com.afx.web.receiptorganizer.types;

public class ReceiptImage {

    /*
    Private fields
     */

    private int id;
    private byte[] receiptImage;

    /*
    Setters and getters
     */

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public byte[] getReceiptImage() {
        return receiptImage;
    }

    public void setReceiptImage(byte[] receiptImage) {
        this.receiptImage = receiptImage;
    }
}
