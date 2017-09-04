package com.afx.web.receiptorganizer.authentication;

import com.afx.web.receiptorganizer.dao.user.UserDao;
import com.afx.web.receiptorganizer.types.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;


@Controller
@RequestMapping("login")
@SessionAttributes("user")
public class LoginController {

    private static Logger logger = LogManager.getLogger(LoginController.class);

    private static Properties appProperties = new Properties();

    @Autowired
    private UserDao userDao;

    static {
        //Get application properties for user defaults.
        InputStream input = null;
        try {
             input = new FileInputStream("application.properties");

             appProperties.load(input);
        } catch(IOException e) {
            logger.error("Unable to get application properties.");
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView loginPage() {
        logger.debug("Request for login page.");
        return new ModelAndView("login", "user", new User());
    }

    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public String loginAction(@ModelAttribute("user") User user, ModelMap model, RedirectAttributes ra) {
        //TODO LDAP Authentication

        if (!this.userDao.isUser(user.getUsername())) {
            //First time user, add user to database
            try {
                user.setPaginationSize(Integer.parseInt(appProperties.getProperty("defaultPaginationSize")));
                this.userDao.add(user);
            } catch (Exception e) {
                //TODO Show error screen.
                logger.error("Unable to add user: " + user.getUsername() + " to database. Failed to login.");
            }
        } else {
            user = this.userDao.getUser(user.getUsername());
        }

        user.setPassword(null);

        model.addAttribute("user", user);

        logger.debug("Login action performed for: " + user.getUsername());
        return "redirect:/home/";
    }
}
