package com.afx.web.receiptorganizer.service.user;

import java.io.IOException;

import com.afx.web.receiptorganizer.dao.model.user.User;

public interface UserService {

    void changeUserSettings(User user) throws IOException;

}