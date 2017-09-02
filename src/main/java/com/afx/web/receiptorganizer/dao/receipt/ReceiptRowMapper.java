package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.Receipt;
import org.apache.commons.codec.binary.Base64;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ReceiptRowMapper implements RowMapper<Receipt> {

    private static Logger logger = LogManager.getLogger(ReceiptRowMapper.class);

    public Receipt mapRow(ResultSet rs, int rowNum) throws SQLException {
        Receipt receipt = new Receipt();
        receipt.setReceiptId(rs.getInt("ReceiptId"));
        receipt.setTitle(rs.getString("Title"));
        receipt.setDescription(rs.getString("Description"));
        receipt.setDate(rs.getDate("Date"));
        receipt.setReceiptAmount(rs.getFloat("ReceiptAmount"));
        receipt.setNumItems(rs.getInt("NumItems"));
        receipt.setFile(rs.getBytes("Image"));

        //Encode image to base64 for viewing in JSP
        try {
            byte[] encodeBase64 = Base64.encodeBase64(rs.getBytes("Image"));
            String base64Encoded = new String(encodeBase64, "UTF-8");
            receipt.setViewableImage(base64Encoded);
        } catch (Exception e) {
            logger.error("Unable to create viewable image from file in row: " + rowNum + " of resultset.");
        }

        return receipt;
    }
}
