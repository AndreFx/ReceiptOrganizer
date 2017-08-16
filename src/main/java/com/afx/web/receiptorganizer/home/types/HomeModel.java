package com.afx.web.receiptorganizer.home.types;

import java.util.List;

public class HomeModel {

    private List<Label> labels;
    private List<Receipt> receipts;

    public List<Label> getLabels() {
        return labels;
    }

    public void setLabels(List<Label> labels) {
        this.labels = labels;
    }

    public List<Receipt> getReceipts() {
        return receipts;
    }

    public void setReceipts(List<Receipt> receipts) {
        this.receipts = receipts;
    }
}
