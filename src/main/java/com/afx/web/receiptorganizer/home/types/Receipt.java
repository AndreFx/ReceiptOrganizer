package com.afx.web.receiptorganizer.home.types;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;
import java.util.Date;

public class Receipt {

    @NotNull
    @Size(min=2, max=50)
    private String title;

    @DateTimeFormat(pattern="MM/dd/yyyy")
    @NotNull
    @Past
    private Date date;

    @NotNull
    private Float receiptAmount;

    @NotNull
    private Integer numItems;

    @Size(max=100)
    private String description;

    private byte[] file;

    @NotNull
    private MultipartFile multipartFile;

    private String[] labels;

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

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
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
}
