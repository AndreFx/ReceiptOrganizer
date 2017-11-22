package com.afx.web.receiptorganizer.types;

public class ReceiptFile {

    /*
    Private fields
     */

    private int id;
    private byte[] receiptFile;
    private String MIME;

    /*
    Setters and getters
     */

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public byte[] getReceiptFile() {
        return receiptFile;
    }

    public void setReceiptFile(byte[] receiptFile) {
        this.receiptFile = receiptFile;
    }

    public String getMIME() {
        return MIME;
    }

    public void setMIME(String MIME) {
        this.MIME = MIME;
    }
}
