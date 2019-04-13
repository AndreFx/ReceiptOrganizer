package com.afx.web.receiptorganizer.dao.receipt.mapper;

import com.afx.web.receiptorganizer.rest.model.response.receipt.ReceiptPage;
import com.afx.web.receiptorganizer.dao.model.label.Label;
import com.afx.web.receiptorganizer.dao.model.receipt.Receipt;
import com.afx.web.receiptorganizer.dao.model.receipt.ReceiptItem;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class ReceiptPageResultSetExtractor  implements ResultSetExtractor<ReceiptPage>{

    @Override
    public ReceiptPage extractData(ResultSet rs) throws SQLException, DataAccessException {
        ReceiptPage receiptsPage = new ReceiptPage();
        ArrayList<Receipt> receipts = new ArrayList<Receipt>();
        boolean setResultCount = false;
        Integer currentId = null;

        Receipt currentReceipt = new Receipt();
        ArrayList<ReceiptItem> currentReceiptItems = null;
        ArrayList<Label> currentReceiptLabels = null;

        //Map rows into receipt objects with their proper items
        while (rs.next()) {
            if (!setResultCount) {
                receiptsPage.setTotalNumReceipts(rs.getInt("ReceiptCount"));
            }

            if (currentId == null || currentId != rs.getInt("ReceiptId")) {
                //First iteration or get next receipt
                currentId = rs.getInt("ReceiptId");

                currentReceipt = new Receipt();
                currentReceiptItems = new ArrayList<>();
                currentReceiptLabels = new ArrayList<>();
                currentReceipt.setId(currentId);
                currentReceipt.setTitle(rs.getString("Title"));
                currentReceipt.setVendor(rs.getString("Vendor"));
                currentReceipt.setDescription(rs.getString("Description"));
                currentReceipt.setFileName(rs.getString("OriginalFileName"));
                currentReceipt.setDate(rs.getDate("Date"));
                currentReceipt.setTax(rs.getBigDecimal("Tax"));
                currentReceipt.setTotal(rs.getBigDecimal("Total"));
                currentReceipt.setItems(currentReceiptItems);
                currentReceipt.setLabels(currentReceiptLabels);

                receipts.add(currentReceipt);
            }

            ReceiptItem currentItem = new ReceiptItem();
            if (rs.getString("Name") != null) {
                currentItem.setItemNumber(rs.getInt("ItemNumber"));
                currentItem.setName(rs.getString("Name"));
                currentItem.setQuantity(rs.getInt("Quantity"));
                currentItem.setWarrantyLength(rs.getInt("WarrantyLength"));
                currentItem.setWarrantyUnit(rs.getString("WarrantyLengthUnit"));

                //Convert unitprice to currency string
                BigDecimal unitPrice = rs.getBigDecimal("UnitPrice");

                currentItem.setUnitPrice(unitPrice);
                
                if (!currentReceipt.getItems().contains(currentItem)) {
                    currentReceiptItems.add(currentItem);
                }
            }

            Label currentLabel = new Label();
            if (rs.getString("LabelName") != null) {
                currentLabel.setName(rs.getString("LabelName"));
                if (!currentReceipt.getLabels().contains(currentLabel)) {
                    currentReceiptLabels.add(currentLabel);
                }
            }
        }

        receiptsPage.setReceipts(receipts);

        return receiptsPage;
    }
}
