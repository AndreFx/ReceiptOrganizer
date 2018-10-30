package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.ReceiptItem;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ReceiptResultSetExtractor  implements ResultSetExtractor<List<Receipt>>{

    @Override
    public List<Receipt> extractData(ResultSet rs) throws SQLException, DataAccessException {
        ArrayList<Receipt> receipts = new ArrayList<>();
        Integer currentId = null;

        Receipt currentReceipt;
        ArrayList<ReceiptItem> currentReceiptItems = null;

        //Map rows into receipt objects with their proper items
        while (rs.next()) {
            if (currentId == null || currentId != rs.getInt("ReceiptId")) {
                //First iteration or get next receipt
                currentId = rs.getInt("ReceiptId");

                currentReceipt = new Receipt();
                currentReceiptItems = new ArrayList<>();
                currentReceipt.setId(currentId);
                currentReceipt.setTitle(rs.getString("Title"));
                currentReceipt.setDate(rs.getDate("Date"));
                currentReceipt.setTotal(rs.getBigDecimal("Total"));
                currentReceipt.setItems(currentReceiptItems);

                receipts.add(currentReceipt);
            }

            ReceiptItem currentItem = new ReceiptItem();
            if (rs.getString("Name") != null) {
                currentItem.setName(rs.getString("Name"));
                currentItem.setQuantity(rs.getInt("Quantity"));

                //Convert unitprice to currency string
                BigDecimal unitPrice = rs.getBigDecimal("UnitPrice");
                currentItem.setUnitPrice(unitPrice);
                currentReceiptItems.add(currentItem);
            }
        }

        return receipts;
    }
}
