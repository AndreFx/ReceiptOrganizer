package com.afx.web.receiptorganizer.users;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.afx.web.receiptorganizer.dao.user.UserDao;
import com.afx.web.receiptorganizer.types.User;
import com.afx.web.receiptorganizer.types.responses.BaseResponse;
import com.afx.web.receiptorganizer.users.types.responses.UserResponse;
import com.afx.web.receiptorganizer.utilities.ImageThumbnailCreator;

import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataAccessException;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

@RestController
@RequestMapping("users")
@SessionAttributes("user")
public class UserController {

    /*
     * Constants
     */

    private static final int THUMBNAIL_HEIGHT = 60;
    private static final int THUMBNAIL_MAX_WIDTH = 64;

    /*
     * Logger
     */

    private static Logger logger = LogManager.getLogger(UserController.class);

    /*
     * Private fields
     */

    @Autowired
    private UserDao userDao;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ServletContext context;

    /*
     * Controller methods
     */

    @RequestMapping(value = "/image", method = RequestMethod.GET)
    public void getUserImage(HttpServletResponse response, @ModelAttribute("user") User user, @RequestParam("thumbnail") boolean scale) {

        try {
            InputStream in;

            // Check if there is a user photo. If there is, there will also be a thumbnail.
            if (user.getUserPhoto() != null) {
                if (scale) {
                    in = new ByteArrayInputStream(user.getUserPhotoThumbnail());
                    response.setContentLength(user.getUserPhotoThumbnail().length);
                    response.setContentType(user.getUserPhotoThumbnailMIME());
                    logger.debug("Retrieved user thumbnail of: " + user.getUserPhotoThumbnail().length + " bytes");
                } else {
                    in = new ByteArrayInputStream(user.getUserPhoto());
                    response.setContentLength(user.getUserPhoto().length);
                    response.setContentType(user.getUserPhotoMIME());
                }
            } else {
                // No image scaling for this default photo, it is small enough to not matter.
                BufferedImage img = ImageIO
                        .read(new File(context.getRealPath("/resources/theme1/images/emptyUserPhoto.png")));
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(img, "png", baos);
                baos.flush();
                in = new ByteArrayInputStream(baos.toByteArray());

                response.setContentLength(baos.toByteArray().length);
                response.setContentType("image/png");
            }

            response.setHeader("content-Disposition", "inline; filename=" + user.getUsername() + "image.png");
            IOUtils.copy(in, response.getOutputStream());
            response.flushBuffer();
            in.close();
        } catch (IOException e) {
            logger.error("Failed to convert user: " + user.getUsername() + " image for storage on database.");
            throw new RuntimeException(e.getMessage());
        }
    }

    @RequestMapping(value = "/edit", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.POST)
    public BaseResponse changeUserSettings(@Valid @RequestBody User user, Locale locale, BindingResult result) {
        String message = "";
        boolean success = false;

        if (!result.hasErrors()) {
            try {
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

                message = messageSource.getMessage("user.edit.success", null, locale);
                success = true;
                logger.debug("User: " + user.getUsername() + " successfully changed user settings");
            } catch (DataAccessException e) {
                message = messageSource.getMessage("user.edit.failure.database", null, locale);
                success = false;
                logger.error("User: " + user.getUsername() + " failed to upload new user photo");
                logger.error("Error description: " + e.getMessage());
                throw e;
            } catch (IOException iox) {
                message = messageSource.getMessage("user.edit.failure.invalidimage", null, locale);
                success = false;
                logger.error("Failed to convert user: " + user.getUsername() + " image for storage on database.");
                throw new RuntimeException(iox.getMessage());
            }
        } else {
            // Shouldn't occur unless jquery validation is broken.
            success = false;
            message = messageSource.getMessage("user.edit.failure.invalid", null, locale);
        }

        return new BaseResponse(success, message);
    }

    @RequestMapping(value = "/", produces = { MediaType.APPLICATION_JSON_VALUE }, method = RequestMethod.GET)
    public UserResponse show(@SessionAttribute("user") User user, Locale locale) {
        logger.debug("Serving request for user data");

        UserResponse response = new UserResponse();
        response.setUser(user);
        response.setSuccess(true);
        response.setMessage(messageSource.getMessage("user.show.success", null, locale));

        return response;
    }
}
