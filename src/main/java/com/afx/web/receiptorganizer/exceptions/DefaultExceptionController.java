package com.afx.web.receiptorganizer.exceptions;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class DefaultExceptionController {

    /*
    Constants
     */

    private static final String DEFAULT_VIEW = "error";

    /*
    Generic exception handlers
     */

    @RequestMapping(value="/internalerror")
    public String handleException(HttpServletRequest req, Model model) {
        Throwable e = (Throwable)req.getAttribute("javax.servlet.error.exception");

        model.addAttribute("exception", e);
        model.addAttribute("errorMessage", "Internal server error. If you are logging in, this probably means the ActiveDirectory" +
                " server is down. Please contact your system administrator.");

        return DEFAULT_VIEW;
    }

}
