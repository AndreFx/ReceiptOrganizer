package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.ReceiptImage;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ReceiptImageRowMapper implements RowMapper<ReceiptImage> {

    public ReceiptImage mapRow(ResultSet rs, int rowNum) throws SQLException {
        ReceiptImage receiptImage = new ReceiptImage();
        receiptImage.setId(rs.getInt(1));
        //Will either be the thumbnail or the source image.
        receiptImage.setReceiptImage(rs.getBytes(2));

        return receiptImage;
    }

}
