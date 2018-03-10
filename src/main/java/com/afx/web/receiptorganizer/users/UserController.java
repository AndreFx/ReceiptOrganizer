package com.afx.web.receiptorganizer.users;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.dao.user.UserDao;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.User;
import com.afx.web.receiptorganizer.utilities.ImageThumbnailCreator;
import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.List;

@Controller
@RequestMapping("users")
@SessionAttributes("user")
public class UserController {

    /*
    Constants
     */

    private static final int THUMBNAIL_HEIGHT = 60;
    private static final int THUMBNAIL_MAX_WIDTH = 64;

    /*
    Logger
     */

    private static Logger logger = LogManager.getLogger(UserController.class);

    /*
    Private fields
     */

    @Autowired
    private LabelDao labelDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ServletContext context;

    /*
    Controller methods
     */

    @RequestMapping(value="/getUserPhoto", method = RequestMethod.GET)
    public void getUserImage(@ModelAttribute("user") User user, @RequestParam("thumbnail") boolean scale, HttpServletResponse response) {

        try {
            InputStream in;

            //Check if there is a user photo. If there is, there will also be a thumbnail.
            if (user.getUserPhotoImage() != null) {
                if (scale) {
                    in = new ByteArrayInputStream(user.getUserPhotoThumbnail());
                    response.setContentLength(user.getUserPhotoThumbnail().length);
                    logger.debug("Retrieved user thumbnail of: " + user.getUserPhotoThumbnail().length + " bytes");
                } else {
                    in = new ByteArrayInputStream(user.getUserPhotoImage());
                    response.setContentLength(user.getUserPhotoImage().length);
                }
            } else {
                //No image scaling for this default photo, it is small enough to not matter.
                BufferedImage img = ImageIO.read(new File(context.getRealPath("/resources/theme1/images/emptyUserPhoto.png")));
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(img, "png", baos);
                baos.flush();
                in = new ByteArrayInputStream(baos.toByteArray());

                response.setContentLength(baos.toByteArray().length);
            }

            response.setContentType("image/png");
            response.setHeader("content-Disposition", "inline; filename=" + user.getUsername() + "image.png");
            IOUtils.copy(in, response.getOutputStream());
            response.flushBuffer();
            in.close();
        } catch(IOException e) {
            logger.error("Failed to convert user: " + user.getUsername() + " image for storage on database.");
            throw new RuntimeException(e.getMessage());
        }
    }

    @RequestMapping(value = "/settings/update", method = RequestMethod.POST)
    public String changeUserSettings(@Valid @ModelAttribute("user") User user, BindingResult result, RedirectAttributes ra) {

        if (!result.hasErrors()) {
            try {
                //Create byte array for transfer to database.
                if (user.getImage() != null && !user.getImage().isEmpty()) {
                    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                    BufferedImage image = ImageIO.read(user.getImage().getInputStream());
                    ImageIO.write(image, "png", outputStream);
                    outputStream.flush();
                    byte[] imageAsBytes = outputStream.toByteArray();
                    outputStream.close();
                    user.setUserPhotoImage(imageAsBytes);

                    //Create byte array for thumbnail
                    long startTime = System.nanoTime();
                    user.setUserPhotoThumbnail(ImageThumbnailCreator.createThumbnail(image, THUMBNAIL_HEIGHT, THUMBNAIL_MAX_WIDTH));
                    logger.debug("Set user thumbnail of: " + user.getUserPhotoThumbnail().length + " bytes");
                    long endTime = System.nanoTime();
                    long duration = (endTime - startTime) / 1000000;
                    logger.debug("Time to scale user: " + user.getUsername() + " image of size: " + imageAsBytes.length + " into a thumbnail: " + duration + "ms");
                }

                this.userDao.changeUserSettings(user);

                logger.debug("User: " + user.getUsername() + " successfully changed user settings");
            } catch (DataAccessException e) {
                logger.error("User: " + user.getUsername() + " failed to upload new user photo");
                logger.error("Error description: " + e.getMessage());
                throw e;
            } catch (IOException iox) {
                logger.error("Failed to convert user: " + user.getUsername() + " image for storage on database.");
                throw new RuntimeException(iox.getMessage());
            }
        } else {
            //Shouldn't occur unless jquery validation is broken.
            return "settings";
        }

        return "redirect:/receipts/";
    }

    @RequestMapping(value = "/settings", method = RequestMethod.GET)
    public String userSettings(@ModelAttribute("user") User user, ModelMap model) {
        logger.debug("Serving user request for settings screen.");

        //All user labels
        List<Label> labels = this.labelDao.getAllUserLabels(user.getUsername());

        model.addAttribute("userLabels", labels);
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());

        return "settings";
    }
}
