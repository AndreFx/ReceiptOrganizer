package com.afx.web.receiptorganizer;

public class User {

    private String username;
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

}
