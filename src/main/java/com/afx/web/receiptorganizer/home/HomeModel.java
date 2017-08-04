package com.afx.web.receiptorganizer.home;

import java.util.ArrayList;

public class HomeModel {

    private ArrayList<Label> labels;
    private ArrayList<Receipt> receipts;

    public ArrayList<Label> getLabels() {
        return labels;
    }

    public void setLabels(ArrayList<Label> labels) {
        this.labels = labels;
    }

    public ArrayList<Receipt> getReceipts() {
        return receipts;
    }

    public void setReceipts(ArrayList<Receipt> receipts) {
        this.receipts = receipts;
    }
}
