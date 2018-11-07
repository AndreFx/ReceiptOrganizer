package com.afx.web.receiptorganizer.service.receipt.receiptparser.impl;

import com.afx.web.receiptorganizer.service.receipt.receiptparser.LogoAndDocumentResponse;
import com.afx.web.receiptorganizer.service.receipt.receiptparser.ReceiptParser;
import com.afx.web.receiptorganizer.service.receipt.receiptparser.ReceiptParserBase;
import com.afx.web.receiptorganizer.dao.model.receipt.Receipt;

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
