package com.afx.web.receiptorganizer.dao.receipt.mapper;

import com.afx.web.receiptorganizer.dao.model.receipt.ReceiptFile;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ReceiptFileRowMapper implements RowMapper<ReceiptFile> {

    public ReceiptFile mapRow(ResultSet rs, int rowNum) throws SQLException {
        ReceiptFile file = new ReceiptFile();
        file.setId(rs.getInt("ReceiptId"));
        
        file.setFile(rs.getBytes("FullFile"));
        file.setMIME(rs.getString("MIME"));

        file.setFileName(rs.getString("OriginalFileName"));
        return file;
    }

}