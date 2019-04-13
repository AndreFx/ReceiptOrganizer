package com.afx.web.receiptorganizer.dao.receipt.mapper;

import com.afx.web.receiptorganizer.dao.model.receipt.ReceiptFile;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ReceiptFileThumbnailRowMapper implements RowMapper<ReceiptFile> {

    public ReceiptFile mapRow(ResultSet rs, int rowNum) throws SQLException {
        ReceiptFile file = new ReceiptFile();

        file.setId(rs.getInt("ReceiptId"));
        file.setThumbnail(rs.getBytes("ImageThumbnail"));
        file.setThumbnailMIME(rs.getString("ThumbnailMIME"));
        file.setFileName(rs.getString("OriginalFileName"));
        
        return file;
    }
}