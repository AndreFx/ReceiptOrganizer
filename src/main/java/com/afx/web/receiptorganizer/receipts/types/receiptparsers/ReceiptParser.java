package com.afx.web.receiptorganizer.receipts.types.receiptparsers;

import com.afx.web.receiptorganizer.receipts.types.LogoAndDocumentResponse;
import com.afx.web.receiptorganizer.types.Receipt;

import java.io.IOException;

public interface ReceiptParser {

    Receipt parseReceipt(Receipt receipt, LogoAndDocumentResponse visionResponse) throws IOException;

}
