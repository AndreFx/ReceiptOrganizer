package com.afx.web.receiptorganizer.rest.exception;

import javax.servlet.http.HttpServletRequest;

import com.afx.web.receiptorganizer.rest.model.response.exception.ExceptionResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
public class DefaultExceptionController {

    /*
    Constants
     */

    /*
    Generic exception handlers
     */

    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @RequestMapping(value="/internalerror", produces = { MediaType.APPLICATION_JSON_VALUE })
    public ExceptionResponse handleException(HttpServletRequest req, Model model) {
        Throwable e = (Throwable)req.getAttribute("javax.servlet.error.exception");

        ExceptionResponse response = new ExceptionResponse();

        response.setExceptionMessage(e.getMessage());
        response.setErrorMessage("Internal server error. If you are logging in, this probably means the ActiveDirectory" +
                " server is down. Please contact your system administrator.");

        return response;
    }

}
