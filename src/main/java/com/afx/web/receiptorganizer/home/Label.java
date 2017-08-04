package com.afx.web.receiptorganizer.home;

public class Label {

    private String labelName;
    private String labelText;
    private String labelDescription;
    private int numberOfReceipts;

    public String getLabelName() {
        return labelName;
    }

    public void setLabelName(String labelName) {
        this.labelName = labelName;
    }

    public String getLabelText() {
        return labelText;
    }

    public void setLabelText(String labelText) {
        this.labelText = labelText;
    }

    public String getLabelDescription() {
        return labelDescription;
    }

    public void setLabelDescription(String labelDescription) {
        this.labelDescription = labelDescription;
    }

    public int getNumberOfReceipts() {
        return numberOfReceipts;
    }

    public void setNumberOfReceipts(int numberOfReceipts) {
        this.numberOfReceipts = numberOfReceipts;
    }
}
