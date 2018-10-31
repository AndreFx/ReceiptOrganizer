package com.afx.web.receiptorganizer.types;

public class ReceiptFile {

    /*
    Private fields
     */

    private Integer id;
    
    
    private String fileName;
    private byte[] file;
    private String MIME;
    private byte[] originalFile;
    private String originalMIME;
    private byte[] thumbnail;
    private String thumbnailMIME;

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }

    public byte[] getOriginalFile() {
        return originalFile;
    }

    public void setOriginalFile(byte[] originalFile) {
        this.originalFile = originalFile;
    }

    public byte[] getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(byte[] thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getThumbnailMIME() {
        return thumbnailMIME;
    }

    public void setThumbnailMIME(String thumbnailMIME) {
        this.thumbnailMIME = thumbnailMIME;
    }

    public String getMIME() {
        return MIME;
    }

    public void setMIME(String MIME) {
        this.MIME = MIME;
    }

    public String getOriginalMIME() {
        return originalMIME;
    }

    public void setOriginalMIME(String originalMIME) {
        this.originalMIME = originalMIME;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
