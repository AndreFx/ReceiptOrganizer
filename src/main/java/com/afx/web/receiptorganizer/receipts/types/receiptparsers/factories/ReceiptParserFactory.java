package com.afx.web.receiptorganizer.receipts.types.receiptparsers.factories;

import com.afx.web.receiptorganizer.receipts.types.receiptparsers.ReceiptParser;
import com.afx.web.receiptorganizer.receipts.types.receiptparsers.impl.AdvanceAutoReceiptParser;
import com.afx.web.receiptorganizer.receipts.types.receiptparsers.impl.NoVendorReceiptParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ReceiptParserFactory {

    /*
    Constants
     */

    @Value("${receipts.thumbnailHeight}")
    private int THUMBNAIL_HEIGHT;
    @Value("${receipts.thumbnailWidth}")
    private int THUMBNAIL_WIDTH;
    @Value("${receipts.maxDescriptionLength}")
    private int MAX_DESCRIPTION_LENGTH;

    public ReceiptParser getReceiptParser(String parserType) {
        if (parserType == null) {
            return new NoVendorReceiptParser(THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH, MAX_DESCRIPTION_LENGTH);
        }

        if (parserType.equals("Advance Auto Parts")) {
            return new AdvanceAutoReceiptParser(THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH, MAX_DESCRIPTION_LENGTH);
        }

        return new NoVendorReceiptParser(THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH, MAX_DESCRIPTION_LENGTH);
    }

}
