package com.afx.web.receiptorganizer.receipts.types.receiptparsers;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

import com.afx.web.receiptorganizer.receipts.types.LogoAndDocumentResponse;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.utilities.ImageThumbnailCreator;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public abstract class ReceiptParserBase implements ReceiptParser {

    /*
    Constants
     */

    private int thumbnailHeight;
    private int thumbnailWidth;
    private int maxDescriptionLength;

    /*
    Logger
     */

    protected static Logger logger = LogManager.getLogger(ReceiptParserBase.class);

    /*
    Constructor
     */

    protected ReceiptParserBase(int thumbnailHeight, int thumbnailWidth, int maxDescriptionLength) {
        this.thumbnailHeight = thumbnailHeight;
        this.thumbnailWidth = thumbnailWidth;
        this.maxDescriptionLength = maxDescriptionLength;
    }

    /*
    ReceiptParser implementation
     */

    public Receipt parseReceipt(Receipt receipt, LogoAndDocumentResponse visionResponse) throws IOException {
        BufferedImage image;
        InputStream imageAsStream = new ByteArrayInputStream(receipt.getFile());

        //Only for ocr compatible receipts
        if (visionResponse.getDocumentText().length() > maxDescriptionLength) {
            //Truncate to fit max length
            receipt.setDescription(visionResponse.getDocumentText().substring(0, maxDescriptionLength));
        } else {
            receipt.setDescription(visionResponse.getDocumentText());
        }
        receipt.setTitle(visionResponse.getLogoDescription());
        receipt.setVendor(visionResponse.getLogoDescription());

        image = ImageIO.read(imageAsStream);
        receipt.setThumbnail(ImageThumbnailCreator.createThumbnail(image, thumbnailHeight, thumbnailWidth));
        receipt.setThumbnailMIME("image/jpeg");

        return receipt;
    }

}
