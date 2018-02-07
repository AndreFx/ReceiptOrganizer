package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.ReceiptFile;
import com.afx.web.receiptorganizer.types.ReceiptItem;

import java.util.List;

public interface ReceiptDao {

    void addReceipt(String username, Receipt receipt);

    void deleteReceipt(String username, int receiptId);

    void editReceipt(String username, Receipt receipt);

    Receipt getReceipt(String username, int receiptId);

    ReceiptFile getReceiptImage(String username, int receiptId, boolean thumbnail);

    ReceiptFile getReceiptFile(String username, int receiptId);

    int getTotalNumUserReceiptsFromString(String username, String searchString);

    int getTotalNumUserReceiptsForLabels(String username, List<String> labels);

    List<Receipt> findRangeUserReceiptsFromString(String username, String searchString, int start, int numRows);

    List<Receipt> getRangeUserReceiptsForLabels(String username, List<String> labels, int start, int numRows);

}
