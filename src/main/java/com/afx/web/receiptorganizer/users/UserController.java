package com.afx.web.receiptorganizer.users;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.dao.user.UserDao;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.User;
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
@SessionAttributes(value={"user"})
public class UserController {

    private static Logger logger = LogManager.getLogger(UserController.class);

    @Autowired
    private LabelDao labelDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    ServletContext context;

    @RequestMapping(value="/getUserPhoto", method = RequestMethod.GET)
    public void getUserImage(@ModelAttribute("user") User user, HttpServletResponse response) {

        try {
            InputStream in;
            if (user.getFile() != null) {
                in = new ByteArrayInputStream(user.getFile());

                response.setContentLength(user.getFile().length);
            } else {
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
                    user.setFile(imageAsBytes);
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

        return "redirect:/home/";
    }

    @RequestMapping(value = "/settings", method = RequestMethod.GET)
    public String userSettings(@ModelAttribute("user") User user, ModelMap model) {
        logger.debug("Serving user request for settings screen.");

        //All user labels
        List<Label> labels = this.labelDao.getAllUserLabels(user.getUsername());

        model.addAttribute("labels", labels);
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());

        return "settings";
    }
}
