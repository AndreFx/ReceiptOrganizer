package com.afx.web.receiptorganizer.receipts.types.receiptparsers.factories;

import com.afx.web.receiptorganizer.receipts.types.receiptparsers.ReceiptParser;
import com.afx.web.receiptorganizer.receipts.types.receiptparsers.impl.AdvanceAutoReceiptParser;
import com.afx.web.receiptorganizer.receipts.types.receiptparsers.impl.NoVendorReceiptParser;

public class ReceiptParserFactory {

    public ReceiptParser getReceiptParser(String parserType) {
        if (parserType == null) {
            return new NoVendorReceiptParser();
        }

        if (parserType.equals("Advance Auto Parts")) {
            return new AdvanceAutoReceiptParser();
        }

        return null;
    }

}
