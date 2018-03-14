package com.afx.web.receiptorganizer.exceptions;

import com.afx.web.receiptorganizer.exceptions.types.ReceiptNotFoundException;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.Receipt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.naming.CommunicationException;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;

@ControllerAdvice
public class GlobalExceptionHandlerController {

    /*
    Constants
     */

    @Value("${exceptions.globalExceptionHandler.defaultView}")
    private String DEFAULT_VIEW = "error";
    private static final String DEFAULT_ERROR_MESSAGE = "ReceiptOrganizer has encountered an error. Please contact your system administrator.";

    /*
    Exception handlers
     */

    @ExceptionHandler(Exception.class)
    public String handleDefaultError(Exception e, Model model) throws Exception {
        if (AnnotationUtils.findAnnotation(e.getClass(), ResponseStatus.class) != null) {
            throw e;
        }

        model.addAttribute("showSidebar", false);
        model.addAttribute("showNavbar", false);
        model.addAttribute("returnLink", "/ReceiptOrganizer/receipts/");
        model.addAttribute("activeLabels", new ArrayList<String>());
        model.addAttribute("userLabels", new ArrayList<Label>());
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());
        model.addAttribute("exception", e);
        model.addAttribute("errorMessage", DEFAULT_ERROR_MESSAGE);

        return DEFAULT_VIEW;
    }

    @ExceptionHandler(ReceiptNotFoundException.class)
    public String handleReceiptNotFound(ReceiptNotFoundException e, Model model){

        model.addAttribute("showSidebar", true);
        model.addAttribute("showNavbar", true);
        model.addAttribute("returnLink", "/ReceiptOrganizer/receipts/");
        model.addAttribute("activeLabels", new ArrayList<String>());
        model.addAttribute("userLabels", new ArrayList<Label>());
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());
        model.addAttribute("exception", e);
        model.addAttribute("errorMessage", "Unable to find receipt with id: " + e.getId() + "\nPlease contact your system administrator.");

        return DEFAULT_VIEW;
    }

    @ExceptionHandler(DataAccessException.class)
    public String handleDataException(DataAccessException e, Model model) {

        model.addAttribute("showSidebar", true);
        model.addAttribute("showNavbar", true);
        model.addAttribute("returnLink", "/ReceiptOrganizer/receipts/");
        model.addAttribute("activeLabels", new ArrayList<String>());
        model.addAttribute("userLabels", new ArrayList<Label>());
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());
        model.addAttribute("exception", e);
        model.addAttribute("errorMessage", "Error sending request to database.\nPlease contact your system administrator.");

        return DEFAULT_VIEW;
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public String handleException(HttpServletRequest req, NoHandlerFoundException nhfe, Model model) {

        model.addAttribute("showSidebar", false);
        model.addAttribute("showNavbar", false);
        model.addAttribute("returnLink", req.getHeader("referer"));
        model.addAttribute("exception", nhfe);
        model.addAttribute("errorMessage", "Internal server error. If you are logging in, this probably means the ActiveDirectory" +
                " server is down. Please contact your system administrator.");

        return DEFAULT_VIEW;
    }
}
