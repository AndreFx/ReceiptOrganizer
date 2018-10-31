package com.afx.web.receiptorganizer.types;

import java.util.Objects;

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

    /*
    Public Methods
     */

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null)
            return false;
        if (getClass() != o.getClass())
            return false;
        Label label = (Label) o;

        return Objects.equals(name, label.getName());
    }
}
