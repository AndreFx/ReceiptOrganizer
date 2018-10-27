package com.afx.web.receiptorganizer.types;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class Label {

    /*
    Private fields
     */

    @Size(min = 1, max = 50)
    @Pattern(regexp = "^(?!All Receipts$)^(.*)|(?!\\S+)")
    private String name;

    /*
    Getters and setters
     */

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
