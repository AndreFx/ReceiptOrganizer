package com.afx.web.receiptorganizer.dao.model.label;

import java.util.Objects;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotBlank;

public class Label {

    /*
    Private fields
     */

    @Size(max=50)
    @NotBlank
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
