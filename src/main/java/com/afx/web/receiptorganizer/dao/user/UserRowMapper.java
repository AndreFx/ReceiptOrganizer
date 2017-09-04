package com.afx.web.receiptorganizer.dao.user;

import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.User;
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
        user.setFile(rs.getBytes("UserPhoto"));
        return user;
    }
}
