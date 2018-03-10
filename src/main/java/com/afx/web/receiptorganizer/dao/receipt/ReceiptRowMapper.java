package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.Receipt;
import org.springframework.jdbc.core.RowMapper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ReceiptRowMapper implements RowMapper<Receipt> {

    public Receipt mapRow(ResultSet rs, int rowNum) throws SQLException {
        Receipt receipt = new Receipt();
        receipt.setReceiptId(rs.getInt("ReceiptId"));
        receipt.setTitle(rs.getString("Title"));
        receipt.setDescription(rs.getString("Description"));
        receipt.setDate(rs.getDate("Date"));
        receipt.setTax(rs.getBigDecimal("Tax"));
        receipt.setTotal(rs.getBigDecimal("Total"));
        receipt.setOriginalFileName(rs.getString("OriginalFileName"));
        return receipt;
    }
}
