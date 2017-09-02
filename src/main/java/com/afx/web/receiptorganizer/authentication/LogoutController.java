package com.afx.web.receiptorganizer.authentication;

import com.afx.web.receiptorganizer.types.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@SessionAttributes("user")
public class LogoutController {

    private static Logger logger = LogManager.getLogger(LogoutController.class);

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public String logoutAction(@SessionAttribute("user") User user, SessionStatus status, RedirectAttributes ra) {
        logger.debug("logout action performed for: " + user.getUsername());
        status.setComplete();
        return "redirect:/";
    }
}
