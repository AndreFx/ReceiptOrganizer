package com.afx.web.receiptorganizer.users.types.responses;

import com.afx.web.receiptorganizer.types.User;
import com.afx.web.receiptorganizer.types.responses.BaseResponse;

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
