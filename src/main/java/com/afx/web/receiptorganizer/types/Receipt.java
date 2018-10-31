package com.afx.web.receiptorganizer.types;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Receipt extends ReceiptFile {

    /*
    Private fields
     */

    @Size(max = 50)
    private String title;
    private Date date;
    private BigDecimal tax;
    private BigDecimal total;
    @Size(max = 2000)
    private String description;
    @Size(max = 50)
    private String vendor;
    private List<Label> labels;
    @Valid
    private List<ReceiptItem> items = new ArrayList<>();

    /*
    Constructors
     */

    public Receipt() {
        //Set defaults for new forms
        total = new BigDecimal(0.00);
        tax = new BigDecimal(0.00);
    }

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

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public List<ReceiptItem> getItems() {
        return items;
    }

    public void setItems(List<ReceiptItem> items) {
        this.items = items;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVendor() {
        return vendor;
    }

    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public List<Label> getLabels() {
        return labels;
    }

    public void setLabels(List<Label> labels) {
        this.labels = labels;
    }
}
