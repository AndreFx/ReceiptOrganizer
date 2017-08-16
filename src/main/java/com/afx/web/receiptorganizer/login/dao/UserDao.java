package com.afx.web.receiptorganizer.login.dao;

import com.afx.web.receiptorganizer.login.types.User;

public interface UserDao {

    boolean isUser(String username);

    void add(User user);

}
