package com.afx.web.receiptorganizer.userview.validators;

import com.afx.web.receiptorganizer.types.Receipt;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Component
public class ReceiptValidator implements Validator {

    public boolean supports(Class<?> aClass) {
        return Receipt.class.equals(aClass);
    }

    public void validate(Object target, Errors errors) {
        Receipt receipt = (Receipt) target;
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "title", "receipt.title.required");

        MultipartFile file = receipt.getMultipartFile();
        if (file == null || file.isEmpty()) {
            errors.rejectValue("multipartFile", "receipt.file.required");
        }
    }
}
