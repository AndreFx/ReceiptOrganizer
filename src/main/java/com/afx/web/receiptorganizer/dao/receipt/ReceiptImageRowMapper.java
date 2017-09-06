package com.afx.web.receiptorganizer.dao.receipt;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ReceiptImageRowMapper implements RowMapper<byte[]> {

    public byte[] mapRow(ResultSet rs, int rowNum) throws SQLException {
        return rs.getBytes("Image");
    }

}
