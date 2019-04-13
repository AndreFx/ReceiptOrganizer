package com.afx.web.receiptorganizer.dao.receipt;

import java.util.List;

import com.afx.web.receiptorganizer.rest.model.response.receipt.ReceiptPage;
import com.afx.web.receiptorganizer.dao.model.receipt.Receipt;
import com.afx.web.receiptorganizer.dao.model.receipt.ReceiptFile;

public interface ReceiptDao {

    int addReceipt(String username, Receipt receipt);

    void deleteReceipt(String username, int receiptId);

    Receipt editReceipt(String username, Receipt receipt);

    Receipt getReceipt(String username, int receiptId);

    ReceiptFile getReceiptFile(String username, int receiptId);

    ReceiptFile getReceiptThumbnail(String username, int receiptId);

    ReceiptPage getRangeUserReceipts(String username, String searchQuery, List<String> labelNames, int start, int numRows);

}
