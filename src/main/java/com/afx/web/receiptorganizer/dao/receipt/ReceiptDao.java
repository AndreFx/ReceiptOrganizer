package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.Receipt;

import java.util.List;

public interface ReceiptDao {

    void addReceipt(String username, Receipt receipt);

    void deleteReceipt(int receiptId);

    void editReceipt(String username, Receipt receipt);

    Receipt getReceipt(String username, int receiptId);

    List<Receipt> getUserReceiptsForLabel(String username, String label);

}
