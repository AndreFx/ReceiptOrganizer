package com.afx.web.receiptorganizer.types;

import java.io.Serializable;

public class User implements Serializable {

    private String username;
    private String fName;
    private String lName;
    private String password;
    private boolean remember;

    public String getUsername() {
	return this.username;
    }

    public void setUsername(String username) {
	this.username = username;
    }

    public String getPassword() {
	return this.password;
    }

    public void setPassword(String password) {
	this.password = password;
    }

    public boolean isRemember() {
	return this.remember;
    }

    public void setRemember(boolean remember) {
	this.remember = remember;
    }

    public String getfName() {
        return fName;
    }

    public void setfName(String fName) {
        this.fName = fName;
    }

    public String getlName() {
        return lName;
    }

    public void setlName(String lName) {
        this.lName = lName;
    }
}
