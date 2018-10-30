package com.afx.web.receiptorganizer.receipts.types.receiptparsers.impl;

import com.afx.web.receiptorganizer.receipts.types.LogoAndDocumentResponse;
import com.afx.web.receiptorganizer.receipts.types.receiptparsers.ReceiptParser;
import com.afx.web.receiptorganizer.receipts.types.receiptparsers.ReceiptParserBase;
import com.afx.web.receiptorganizer.types.Receipt;

import java.io.IOException;

public class NoVendorReceiptParser extends ReceiptParserBase implements ReceiptParser {

    /*
    Constructors
     */

    public NoVendorReceiptParser(int thumbnailHeight, int thumbnailWidth, int maxDescriptionLength) {
        super(thumbnailHeight, thumbnailWidth, maxDescriptionLength);
    }

    /*
    ReceiptParser implementation
     */

    @Override
    public Receipt parseReceipt(Receipt receipt, LogoAndDocumentResponse visionResponse) throws IOException {
        return super.parseReceipt(receipt, visionResponse);
    }
}
