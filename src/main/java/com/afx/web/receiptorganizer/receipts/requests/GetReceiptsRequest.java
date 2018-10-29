package com.afx.web.receiptorganizer.receipts.requests;

import com.afx.web.receiptorganizer.types.Label;

import java.util.List;

public class GetReceiptsRequest {


    /*
    Private fields
     */

    private String query;
    private List<Label> activeLabels;
    private int pageNum;

    /*
    Getters and setters
     */

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public List<Label> getActiveLabels() {
        return activeLabels;
    }

    public void setActiveLabels(List<Label> filterLabels) {
        this.activeLabels = filterLabels;
    }

    public int getPageNum() {
        return pageNum;
    }

    public void setPageNum(int pageNum) {
        this.pageNum = pageNum;
    }

}