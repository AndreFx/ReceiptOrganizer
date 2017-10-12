package com.afx.web.receiptorganizer.utilities;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class ImageThumbnailCreator {


    /*
    Public static utility methods
     */

    public static byte[] createThumbnail(BufferedImage image, int thumbnailHeight, int maxWidth) throws IOException {

        double ratio = thumbnailHeight / (double) image.getHeight();
        double width = ratio * image.getWidth();
        BufferedImage thumbnail;

        if ((int) width > maxWidth) {
            thumbnail = new BufferedImage(maxWidth, thumbnailHeight, BufferedImage.TYPE_INT_RGB);
            thumbnail.createGraphics().drawImage(image.getScaledInstance(maxWidth, thumbnailHeight, Image.SCALE_SMOOTH), 0, 0, null);
        } else {
            //Includes time to convert
            thumbnail = new BufferedImage((int) width, thumbnailHeight, BufferedImage.TYPE_INT_RGB);
            thumbnail.createGraphics().drawImage(image.getScaledInstance((int) width, thumbnailHeight, Image.SCALE_SMOOTH), 0, 0, null);
        }
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(thumbnail, "jpg", baos);
        baos.flush();
        byte[] thumbnailAsBytes = baos.toByteArray();
        baos.close();

        return thumbnailAsBytes;
    }
}
