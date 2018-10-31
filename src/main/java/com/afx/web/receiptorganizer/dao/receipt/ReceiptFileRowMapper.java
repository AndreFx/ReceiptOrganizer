package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.ReceiptFile;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ReceiptFileRowMapper implements RowMapper<ReceiptFile> {

    public ReceiptFile mapRow(ResultSet rs, int rowNum) throws SQLException {
        ReceiptFile file = new ReceiptFile();
        file.setId(rs.getInt("ReceiptId"));
        
        String originalFileMIME = null;
        try {
            originalFileMIME = rs.getString("OriginalFileMIME");
        } catch(SQLException sqlE) {
            //Don't need to do anything here
        }
        
        //If this is declared, the original file was converted from something else (Probably a pdf)
        if (originalFileMIME != null) {
            file.setOriginalFile(rs.getBytes("OriginalFile"));
            file.setOriginalMIME(originalFileMIME);
        } else {
            //Otherwise, get the normal image
            file.setFile(rs.getBytes("FullImage"));
            file.setMIME(rs.getString("MIME"));
        }

        file.setFileName(rs.getString("OriginalFileName"));
        return file;
    }

}