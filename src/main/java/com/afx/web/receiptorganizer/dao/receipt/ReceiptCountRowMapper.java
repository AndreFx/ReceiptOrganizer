package com.afx.web.receiptorganizer.dao.receipt;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ReceiptCountRowMapper implements RowMapper<Integer> {

    public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
        return rs.getInt("Count");
    }
}
