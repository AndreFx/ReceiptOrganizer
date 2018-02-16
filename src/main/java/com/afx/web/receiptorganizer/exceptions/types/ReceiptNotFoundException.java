package com.afx.web.receiptorganizer.exceptions.types;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.NOT_FOUND, reason="No such receipt")
public class ReceiptNotFoundException extends RuntimeException {

    /*
    Private fields
     */

    private int id;

    /*
    Getters and setters
     */

    public ReceiptNotFoundException(int id) {
        this.id = id;
    }

    public int getId() {
        return this.id;
    }

}
