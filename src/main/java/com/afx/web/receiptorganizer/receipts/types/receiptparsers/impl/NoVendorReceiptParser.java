package com.afx.web.receiptorganizer.receipts.types.receiptparsers.impl;

import com.afx.web.receiptorganizer.receipts.types.LogoAndDocumentResponse;
import com.afx.web.receiptorganizer.receipts.types.receiptparsers.ReceiptParser;
import com.afx.web.receiptorganizer.receipts.types.receiptparsers.ReceiptParserBase;
import com.afx.web.receiptorganizer.types.Receipt;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public class NoVendorReceiptParser extends ReceiptParserBase implements ReceiptParser {

    @Override
    public Receipt getReceipt(MultipartFile receiptImage, LogoAndDocumentResponse visionResponse) throws IOException {
        return super.getReceipt(receiptImage, visionResponse);
    }
}
