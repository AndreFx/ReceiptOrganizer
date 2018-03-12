package com.afx.web.receiptorganizer.receipts.types.receiptparsers;

import com.afx.web.receiptorganizer.receipts.types.LogoAndDocumentResponse;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.utilities.ImageThumbnailCreator;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;

public abstract class ReceiptParserBase implements ReceiptParser {

    /*
    Constants
     */

    private static final int THUMBNAIL_HEIGHT = 84;
    private static final int THUMBNAIL_MAX_WIDTH = 175;
    private static final int MAX_DESCRIPTION_LENGTH = 2000;

    /*
    Logger
     */

    protected static Logger logger = LogManager.getLogger(ReceiptParserBase.class);

    /*
    ReceiptParser implementation
     */

    public Receipt getReceipt(MultipartFile receiptImage, LogoAndDocumentResponse visionResponse) throws IOException {
        BufferedImage image;
        InputStream imageAsStream = receiptImage.getInputStream();
        byte[] imageAsBytes = receiptImage.getBytes();
        Receipt data = new Receipt();
        data.setMIME(receiptImage.getContentType());
        data.setOriginalFileName(receiptImage.getOriginalFilename());

        //Only for ocr compatible receipts
        if (visionResponse.getDocumentText().length() > MAX_DESCRIPTION_LENGTH) {
            //Truncate to fit max length
            data.setDescription(visionResponse.getDocumentText().substring(0, MAX_DESCRIPTION_LENGTH));
        } else {
            data.setDescription(visionResponse.getDocumentText());
        }
        data.setTitle(visionResponse.getLogoDescription());
        data.setVendor(visionResponse.getLogoDescription());

        image = ImageIO.read(imageAsStream);
        data.setReceiptFullImage(imageAsBytes);

        //Create byte array for thumbnail
        long startTime = System.nanoTime();
        data.setReceiptThumbnail(ImageThumbnailCreator.createThumbnail(image, THUMBNAIL_HEIGHT, THUMBNAIL_MAX_WIDTH));
        long endTime = System.nanoTime();
        long duration = (endTime - startTime) / 1000000;
        logger.debug("Time to scale receipt image of size: " + imageAsBytes.length + " into a thumbnail: " + duration + "ms");

        return data;
    }

}
