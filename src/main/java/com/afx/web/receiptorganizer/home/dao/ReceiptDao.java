package com.afx.web.receiptorganizer.home.dao;

import com.afx.web.receiptorganizer.home.types.Receipt;

import java.util.List;

public interface ReceiptDao {

    void addReceipt(String username, Receipt receipt);

    void deleteReceipt(String username, Receipt receipt);

    void editReceipt(String username, Receipt receipt);

    List<Receipt> getUserReceiptsForLabel(String username);

}
