package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.Receipt;
import org.springframework.jdbc.core.RowMapper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ReceiptRowMapper implements RowMapper<Receipt> {

    public Receipt mapRow(ResultSet rs, int rowNum) throws SQLException {
        Receipt receipt = new Receipt();
        receipt.setReceiptId(rs.getInt("ReceiptId"));
        receipt.setTitle(rs.getString("Title"));
        receipt.setDate(rs.getDate("Date"));

        //Convert receiptamount to currency string
        BigDecimal amount = rs.getBigDecimal("ReceiptAmount");
        receipt.setReceiptAmount(amount);
        //NumberFormat formatter = NumberFormat.getCurrencyInstance();
        //receipt.setReceiptAmountCurrency(formatter.format(amount));
        return receipt;
    }
}
