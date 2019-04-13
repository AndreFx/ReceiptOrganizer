package com.afx.web.receiptorganizer.dao.user;

import com.afx.web.receiptorganizer.dao.model.user.User;

public interface UserDao {

    void add(User user);

    User getUser(String username);

    void changeUserSettings(User user);

}
