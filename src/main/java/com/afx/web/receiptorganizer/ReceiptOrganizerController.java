package com.afx.web.receiptorganizer;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@SessionAttributes("username")
public class ReceiptOrganizerController {

    private static Logger logger = LogManager.getLogger(ReceiptOrganizerController.class);

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView loginPage(ModelMap model) {
        logger.debug("Request for login page.");
        return new ModelAndView("login", "command", new User());
    }

    @RequestMapping(value = "/login.do", method = RequestMethod.POST)
    public String loginAction(@ModelAttribute("SpringWeb") User user, ModelMap model, RedirectAttributes ra) {
        model.addAttribute("username", user.getUsername());

        logger.debug("Login action performed for: " + user.getUsername());
        return "redirect:/home/";
    }

    @RequestMapping(value = "/home/", method = RequestMethod.GET)
    public String homeView(ModelMap model) {

        return "home";
    }

}
