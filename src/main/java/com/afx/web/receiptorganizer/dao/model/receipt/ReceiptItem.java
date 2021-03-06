package com.afx.web.receiptorganizer.dao.model.receipt;

import java.math.BigDecimal;

import java.util.Objects;

public class ReceiptItem {

    /*
    Private fields
     */

     //TODO: Validation
    private Integer itemNumber;
    private String name;
    private int quantity;
    private BigDecimal unitPrice;
    private int warrantyLength;
    private String warrantyUnit;

    /*
    Getters and setters
     */

    public int getItemNumber() {
        return itemNumber;
    }

    public void setItemNumber(int itemNumber) {
        this.itemNumber = itemNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public int getWarrantyLength() {
        return warrantyLength;
    }

    public void setWarrantyLength(int warrantyLength) {
        this.warrantyLength = warrantyLength;
    }

    public String getWarrantyUnit() {
        return warrantyUnit;
    }

    public void setWarrantyUnit(String warrantyUnit) {
        this.warrantyUnit = warrantyUnit;
    }

    /*
    Public Methods
     */

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null)
            return false;
        if (getClass() != o.getClass())
            return false;
        ReceiptItem item = (ReceiptItem) o;

        return Objects.equals(itemNumber, item.getItemNumber()) && Objects.equals(name, item.getName());
    }
}
