package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.Receipt;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ReceiptRowMapper implements RowMapper<Receipt> {

    public Receipt mapRow(ResultSet rs, int rowNum) throws SQLException {
        Receipt receipt = new Receipt();
        receipt.setReceiptId(rs.getInt("ReceiptId"));
        receipt.setTitle(rs.getString("Title"));
        receipt.setDescription(rs.getString("Description"));
        receipt.setDate(rs.getDate("Date"));
        receipt.setReceiptAmount(rs.getFloat("ReceiptAmount"));
        receipt.setNumItems(rs.getInt("NumItems"));
        receipt.setFile(rs.getBytes("Image"));
        return receipt;
    }
}
