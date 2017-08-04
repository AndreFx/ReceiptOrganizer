package com.afx.web.receiptorganizer.logout;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.context.request.WebRequest;

@Controller
public class LogoutController {

    private static Logger logger = LogManager.getLogger(LogoutController.class);

    @RequestMapping(value = "/logout.do", method = RequestMethod.POST)
    public String loginAction(SessionStatus status, WebRequest request) {
        status.setComplete();
        request.removeAttribute("username", WebRequest.SCOPE_SESSION);

        logger.debug("logout action performed for: ");
        return "redirect:/";
    }


}
