package com.afx.web.receiptorganizer.receipts.types.receiptparsers;

import com.afx.web.receiptorganizer.receipts.types.LogoAndDocumentResponse;
import com.afx.web.receiptorganizer.types.Receipt;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ReceiptParser {

    Receipt getReceipt(MultipartFile receiptImage, LogoAndDocumentResponse visionResponse) throws IOException;

}
