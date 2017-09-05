package com.afx.web.receiptorganizer.exceptions;

import com.afx.web.receiptorganizer.exceptions.types.ReceiptNotFoundException;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandlerController {

    private static final String DEFAULT_VIEW = "error";
    private static final String DEFAULT_ERROR_MESSAGE = "ReceiptOrganizer has encountered an error. Please contact your system administrator.";

    @ExceptionHandler(Exception.class)
    public String handleDefaultError(Exception e, Model model) throws Exception {
        if (AnnotationUtils.findAnnotation(e.getClass(), ResponseStatus.class) != null) {
            throw e;
        }

        model.addAttribute("exception", e);
        model.addAttribute("errorMessage", DEFAULT_ERROR_MESSAGE);

        return DEFAULT_VIEW;
    }

    @ExceptionHandler(ReceiptNotFoundException.class)
    public String handleReceiptNotFound(ReceiptNotFoundException e, Model model){
        model.addAttribute("exception", e);
        model.addAttribute("errorMessage", "Unable to find receipt with id: " + e.getId() + "\nPlease contact your system administrator.");

        return DEFAULT_VIEW;
    }

}
