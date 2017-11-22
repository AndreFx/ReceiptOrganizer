package com.afx.web.receiptorganizer.types;

import org.springframework.web.multipart.MultipartFile;
import java.util.Date;


public class Receipt {

    /*
    Private fields
     */

    private String title;
    private Date date;
    private Float receiptAmount;
    private Integer numItems;
    private String description;
    private byte[] receiptPDF;
    private byte[] receiptFullImage;
    private byte[] receiptThumbnail;
    private String MIME;
    private MultipartFile multipartFile;
    private String[] labels;
    private Integer receiptId;

    /*
    Getters and setters
     */


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Float getReceiptAmount() {
        return receiptAmount;
    }

    public void setReceiptAmount(Float receiptAmount) {
        this.receiptAmount = receiptAmount;
    }

    public Integer getNumItems() {
        return numItems;
    }

    public void setNumItems(Integer numItems) {
        this.numItems = numItems;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getReceiptPDF() {
        return receiptPDF;
    }

    public void setReceiptPDF(byte[] receiptPDF) {
        this.receiptPDF = receiptPDF;
    }

    public byte[] getReceiptFullImage() {
        return receiptFullImage;
    }

    public void setReceiptFullImage(byte[] receiptFullImage) {
        this.receiptFullImage = receiptFullImage;
    }

    public byte[] getReceiptThumbnail() {
        return receiptThumbnail;
    }

    public void setReceiptThumbnail(byte[] receiptThumbnail) {
        this.receiptThumbnail = receiptThumbnail;
    }

    public String getMIME() {
        return MIME;
    }

    public void setMIME(String MIME) {
        this.MIME = MIME;
    }

    public MultipartFile getMultipartFile() {
        return multipartFile;
    }

    public void setMultipartFile(MultipartFile multipartFile) {
        this.multipartFile = multipartFile;
    }

    public String[] getLabels() {
        return labels;
    }

    public void setLabels(String[] labels) {
        this.labels = labels;
    }

    public Integer getReceiptId() {
        return receiptId;
    }

    public void setReceiptId(Integer receiptId) {
        this.receiptId = receiptId;
    }
}
