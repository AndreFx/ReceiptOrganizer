package com.afx.web.receiptorganizer.rest.validator.receipt;

import com.afx.web.receiptorganizer.dao.model.receipt.Receipt;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class ReceiptValidator implements Validator {

    public boolean supports(Class<?> aClass) {
        return Receipt.class.equals(aClass);
    }

    public void validate(Object target, Errors errors) {
        Receipt receipt = (Receipt) target;
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "title", "receipt.title.required");

        byte[] file = receipt.getFile();
        if (file == null || file.length == 0) {
            errors.rejectValue("file", "receipt.file.required");
        }
    }
}
