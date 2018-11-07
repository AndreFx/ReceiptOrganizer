package com.afx.web.receiptorganizer.rest.model.response.user;

import com.afx.web.receiptorganizer.dao.model.user.User;
import com.afx.web.receiptorganizer.rest.model.response.BaseResponse;

public class UserResponse extends BaseResponse {

    /*
     * Private fields
     */

    private User user;

    /*
     * Getters and setters
     */

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
