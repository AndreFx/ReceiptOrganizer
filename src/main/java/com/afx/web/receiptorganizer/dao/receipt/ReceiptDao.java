package com.afx.web.receiptorganizer.dao.receipt;

import java.util.List;

import com.afx.web.receiptorganizer.types.Receipt;

public interface ReceiptDao {

    int addReceipt(String username, Receipt receipt);

    void deleteReceipt(String username, int receiptId);

    void editReceipt(String username, Receipt receipt);

    Receipt getReceipt(String username, int receiptId);

    int getTotalNumUserReceiptsFromString(String username, String searchString);

    int getTotalNumUserReceiptsForLabels(String username, List<String> labelNames);

    List<Receipt> findRangeUserReceiptsFromString(String username, String searchString, int start, int numRows);

    List<Receipt> getRangeUserReceiptsForLabels(String username, List<String> labelNames, int start, int numRows);

}
