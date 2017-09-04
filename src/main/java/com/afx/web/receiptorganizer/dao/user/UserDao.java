package com.afx.web.receiptorganizer.dao.user;

import com.afx.web.receiptorganizer.types.User;

public interface UserDao {

    boolean isUser(String username);

    void add(User user);

    User getUser(String username);

    void changeUserSettings(User user);

}
