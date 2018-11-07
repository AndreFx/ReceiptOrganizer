package com.afx.web.receiptorganizer.service.user;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

import com.afx.web.receiptorganizer.dao.model.user.User;
import com.afx.web.receiptorganizer.dao.user.UserDao;
import com.afx.web.receiptorganizer.utilities.ImageThumbnailCreator;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class UserServiceV1 implements UserService {

    /*
     * Constants
     */

    @Value("${users.thumbnailHeight}")
    private int THUMBNAIL_HEIGHT;
    @Value("${users.thumbnailMaxWidth}")
    private int THUMBNAIL_MAX_WIDTH;

    /*
     * Logger
     */

    private static Logger logger = LogManager.getLogger(UserServiceV1.class);

    /*
     * Private fields
     */

    @Autowired
    private UserDao userDao;

    public void changeUserSettings(User user) throws IOException {
        // Create byte array for transfer to database.
        if (user.getUserPhoto().length != 0) {
            InputStream imageAsStream = new ByteArrayInputStream(user.getUserPhoto());
            BufferedImage image = ImageIO.read(imageAsStream);

            // Create byte array for thumbnail
            long startTime = System.nanoTime();
            user.setUserPhotoThumbnail(ImageThumbnailCreator.createThumbnail(image, THUMBNAIL_HEIGHT, THUMBNAIL_MAX_WIDTH));
            user.setUserPhotoThumbnailMIME("image/jpeg");
            logger.debug("Set user thumbnail of: " + user.getUserPhotoThumbnail().length + " bytes");
            long endTime = System.nanoTime();
            long duration = (endTime - startTime) / 1000000;
            logger.debug("Time to scale user: " + user.getUsername() + " image of size: " + user.getUserPhoto().length
                    + " into a thumbnail: " + duration + "ms");
        }

        this.userDao.changeUserSettings(user);
    }

}