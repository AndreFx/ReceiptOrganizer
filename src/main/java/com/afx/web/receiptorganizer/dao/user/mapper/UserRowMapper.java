package com.afx.web.receiptorganizer.dao.user.mapper;

import com.afx.web.receiptorganizer.dao.model.user.User;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRowMapper implements RowMapper<User> {

    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setUsername(rs.getString("Username"));
        user.setfName(rs.getString("fName"));
        user.setlName(rs.getString("lName"));
        user.setPaginationSize(rs.getInt("PaginationSize"));
        user.setUserPhoto(rs.getBytes("UserPhoto"));
        user.setUserPhotoFileName(rs.getString("UserPhotoFileName"));
        user.setUserPhotoMIME(rs.getString("UserPhotoMIME"));
        user.setUserPhotoThumbnail(rs.getBytes("UserPhotoThumbnail"));
        user.setUserPhotoThumbnailMIME(rs.getString("UserPhotoThumbnailMIME"));
        return user;
    }
}
