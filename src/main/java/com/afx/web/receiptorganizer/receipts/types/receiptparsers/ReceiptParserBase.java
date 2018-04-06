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

    public Receipt getReceipt(MultipartFile receiptImage, LogoAndDocumentResponse visionResponse) throws IOException {
        BufferedImage image;
        InputStream imageAsStream = receiptImage.getInputStream();
        byte[] imageAsBytes = receiptImage.getBytes();
        Receipt data = new Receipt();
        data.setMIME(receiptImage.getContentType());
        data.setOriginalFileName(receiptImage.getOriginalFilename());

        //Only for ocr compatible receipts
        if (visionResponse.getDocumentText().length() > maxDescriptionLength) {
            //Truncate to fit max length
            data.setDescription(visionResponse.getDocumentText().substring(0, maxDescriptionLength));
        } else {
            data.setDescription(visionResponse.getDocumentText());
        }
        data.setTitle(visionResponse.getLogoDescription());
        data.setVendor(visionResponse.getLogoDescription());

        image = ImageIO.read(imageAsStream);
        data.setReceiptFullImage(imageAsBytes);
        data.setReceiptThumbnail(ImageThumbnailCreator.createThumbnail(image, thumbnailHeight, thumbnailWidth));

        return data;
    }

}
