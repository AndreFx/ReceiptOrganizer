package com.afx.web.receiptorganizer.service.receipt.receiptparser;

import com.afx.web.receiptorganizer.dao.model.receipt.Receipt;

import java.io.IOException;

public interface ReceiptParser {

    Receipt parseReceipt(Receipt receipt, LogoAndDocumentResponse visionResponse) throws IOException;

}
