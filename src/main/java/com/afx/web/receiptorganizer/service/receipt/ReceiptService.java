package com.afx.web.receiptorganizer.service.receipt;

import java.util.List;

import com.afx.web.receiptorganizer.rest.model.response.receipt.ReceiptPage;
import com.afx.web.receiptorganizer.dao.model.receipt.Receipt;
import com.afx.web.receiptorganizer.dao.model.receipt.ReceiptFile;

public interface ReceiptService {

    Receipt addReceipt(String username, Receipt receipt, boolean skipOcr) throws Exception;

    void deleteReceipt(String username, int receiptId);

    Receipt editReceipt(String username, Receipt receipt);

    Receipt getReceipt(String username, int receiptId);

    ReceiptFile getReceiptFile(String username, int receiptId);

    ReceiptFile getReceiptThumbnail(String username, int receiptId);

    ReceiptPage getReceiptPage(String username, String searchQuery, List<String> labelNames, int start, int numRows);

}
