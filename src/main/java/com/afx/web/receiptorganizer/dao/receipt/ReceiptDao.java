package com.afx.web.receiptorganizer.dao.receipt;

import java.util.List;

import com.afx.web.receiptorganizer.receipts.types.responses.ReceiptsPage;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.ReceiptFile;

public interface ReceiptDao {

    int addReceipt(String username, Receipt receipt);

    void deleteReceipt(String username, int receiptId);

    void editReceipt(String username, Receipt receipt);

    Receipt getReceipt(String username, int receiptId);

    ReceiptFile getReceiptFile(String username, int receiptId);

    ReceiptFile getReceiptThumbnail(String username, int receiptId);

    ReceiptsPage getRangeUserReceipts(String username, String searchQuery, List<String> labelNames, int start, int numRows);

}
