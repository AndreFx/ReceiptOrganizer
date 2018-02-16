package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.ReceiptFile;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ReceiptFileRowMapper implements RowMapper<ReceiptFile> {

    public ReceiptFile mapRow(ResultSet rs, int rowNum) throws SQLException {
        ReceiptFile file = new ReceiptFile();
        file.setId(rs.getInt(1));
        file.setReceiptFile(rs.getBytes(2));
        file.setMIME(rs.getString(3));

        return file;
    }

}
