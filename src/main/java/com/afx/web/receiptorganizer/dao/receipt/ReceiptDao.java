package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.ReceiptFile;
import com.afx.web.receiptorganizer.types.ReceiptImage;

import java.awt.image.BufferedImage;
import java.util.HashMap;
import java.util.List;

public interface ReceiptDao {

    void addReceipt(String username, Receipt receipt);

    void deleteReceipt(String username, int receiptId);

    void editReceipt(String username, Receipt receipt);

    Receipt getReceipt(String username, int receiptId);

    ReceiptImage getReceiptImage(String username, int receiptId, boolean thumbnail);

    ReceiptFile getReceiptFile(String username, int receiptId);

    int getTotalNumUserReceiptsFromString(String username, String searchString);

    int getTotalNumUserReceiptsForLabel(String username, String label);

    List<Receipt> findRangeUserReceiptsFromString(String username, String searchString, int start, int numRows);

    List<Receipt> getRangeUserReceiptsForLabel(String username, String label, int start, int numRows);

}
