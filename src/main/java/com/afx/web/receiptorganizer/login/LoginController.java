package com.afx.web.receiptorganizer.login;

import com.afx.web.receiptorganizer.login.dao.UserDao;
import com.afx.web.receiptorganizer.login.types.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Controller
@SessionAttributes("user")
public class LoginController {

    private static Logger logger = LogManager.getLogger(LoginController.class);

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView loginPage() {
        logger.debug("Request for login page.");
        return new ModelAndView("login", "user", new User());
    }

    @RequestMapping(value = "/login.do", method = RequestMethod.POST)
    public String loginAction(@ModelAttribute("user") User user, RedirectAttributes ra) {
        //TODO LDAP Authentication

        if (!userDao.isUser(user.getUsername())) {
            //First time user, add user to database.
            try {
                userDao.add(user);
            } catch (Exception e) {
                //TODO Show error screen.
                logger.error("Unable to add user: " + user.getUsername() + " to database. Failed to login.");
            }
        }

        logger.debug("Login action performed for: " + user.getUsername());
        return "redirect:/home/";
    }

    @RequestMapping(value = "/logout.do", method = RequestMethod.POST)
    public String logoutAction(@SessionAttribute("user") User user,  SessionStatus status, RedirectAttributes ra) {
        logger.debug("logout action performed for: " + user.getUsername());
        status.setComplete();
        return "redirect:/";
    }
}
