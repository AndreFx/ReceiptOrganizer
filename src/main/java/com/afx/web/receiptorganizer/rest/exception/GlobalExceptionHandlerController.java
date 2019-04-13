package com.afx.web.receiptorganizer.rest.exception;

import javax.servlet.http.HttpServletRequest;

import com.afx.web.receiptorganizer.rest.model.response.exception.ExceptionResponse;

import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class GlobalExceptionHandlerController {

    /*
    Constants
     */

    private static final String DEFAULT_ERROR_MESSAGE = "ReceiptOrganizer has encountered an error. Please contact your system administrator.";

    /*
    Exception handlers
     */

    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ExceptionResponse handleDefaultError(Exception e, Model model) throws Exception {
        if (AnnotationUtils.findAnnotation(e.getClass(), ResponseStatus.class) != null) {
            throw e;
        }

        ExceptionResponse response = new ExceptionResponse();

        response.setExceptionMessage(e.getMessage());
        response.setErrorMessage(DEFAULT_ERROR_MESSAGE);

        return response;
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(DataAccessException.class)
    public ExceptionResponse handleDataException(DataAccessException e, Model model) {
        ExceptionResponse response = new ExceptionResponse();

        response.setExceptionMessage(e.getMessage());
        response.setErrorMessage("Error sending request to database.\nPlease contact your system administrator.");

        return response;
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(NoHandlerFoundException.class)
    public ExceptionResponse handleException(HttpServletRequest req, NoHandlerFoundException nhfe, Model model) {
        ExceptionResponse response = new ExceptionResponse();

        response.setExceptionMessage(nhfe.getMessage());
        response.setErrorMessage("Internal server error. If you are logging in, this probably means the ActiveDirectory" +
        " server is down. Please contact your system administrator.");

        return response;
    }
}
