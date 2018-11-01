package com.afx.web.receiptorganizer.dao.receipt;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.afx.web.receiptorganizer.receipts.types.responses.ReceiptsPage;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.Receipt;
import com.afx.web.receiptorganizer.types.ReceiptFile;
import com.afx.web.receiptorganizer.types.ReceiptItem;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

@Repository
@Qualifier("receiptDao")
public class ReceiptDaoImpl implements ReceiptDao {

    /*
    Logger
     */
    private static Logger logger = LogManager.getLogger(ReceiptDaoImpl.class);

    /*
    Private fields
     */
    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    @Autowired
    private PlatformTransactionManager transactionManager;

    /*
    Data access methods
     */

    public int addReceipt(String username, Receipt receipt) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        if (receipt.getTotal() == null) {
            receipt.setTotal(new BigDecimal(0.00));
        }
        if (receipt.getTax() == null) {
            receipt.setTax(new BigDecimal(0.00));
        }

        KeyHolder keyHolder;

        try {
            //Insert into RECEIPT table first.
            String sql = "INSERT INTO RECEIPT " +
                    "VALUES (:title, :vendor, :description, :date, :tax, :total, :originalFile, :fileName, :originalMIME, " +
                    ":file, :MIME, :thumbnail, :thumbnailMIME)";
            keyHolder = new GeneratedKeyHolder();

            //BeanPropertySqlParameterSource uses reflection to map the fields to the params, make sure no other object
            //has fields with the same name as receipt.
            this.jdbcTemplate.update(sql, new BeanPropertySqlParameterSource(receipt), keyHolder);

            //Insert into RECEIPT_ITEM
            receipt.setId(keyHolder.getKey().intValue());
            Map<String, ?>[] receiptItemBatchParams = getReceiptItemBatchParams(receipt);
            if (receiptItemBatchParams != null) {
                String receiptItemSql = "INSERT INTO RECEIPT_ITEM " +
                        "VALUES (:receiptid, :itemnumber, :name, :quantity, :unitprice, :warrantylength, :warrantylengthunit)";
                this.jdbcTemplate.batchUpdate(receiptItemSql, receiptItemBatchParams);
            }

            //Insert into USER_RECEIPTS
            Map<String, Object> userReceiptParameters = new HashMap<>();
            userReceiptParameters.put("username", username);
            userReceiptParameters.put("receiptid", keyHolder.getKey().intValue());
            String userReceiptsSql = "INSERT INTO USER_RECEIPTS " +
                    "VALUES (:username, :receiptid)";
            this.jdbcTemplate.update(userReceiptsSql, userReceiptParameters);

            //Insert into RECEIPT_LABELS
            receipt.setId(keyHolder.getKey().intValue());
            Map<String, ?>[] batchParams = getLabelBatchParams(username, receipt);
            String batchSql = "INSERT INTO RECEIPT_LABELS " +
                    "VALUES (:receiptid, :username, :labelname)";
            this.jdbcTemplate.batchUpdate(batchSql, batchParams);
            transactionManager.commit(status);
        } catch (DataAccessException e) {
            logger.error("Unable to add receipt to database. Error: " + e.getMessage());
            transactionManager.rollback(status);
            throw e;
        }

        return keyHolder.getKey().intValue();
    }

    public void deleteReceipt(String username, int receiptId) {

        try {
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("receiptid", receiptId);
            parameters.put("username", username);
            String sql = "DELETE FROM RECEIPT " +
                    "WHERE ReceiptId = :receiptid " +
                    "AND ReceiptId IN (SELECT RECEIPT.ReceiptId " +
                    "                   FROM USER_RECEIPTS INNER JOIN RECEIPT" +
                    "                   ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId" +
                    "                   WHERE USER_RECEIPTS.Username = :username)";
            this.jdbcTemplate.update(sql, parameters);
        } catch (DataAccessException e) {
            logger.error("Unable to delete receipt from database. Error: " + e.getMessage());
            throw e;
        }
    }

    public void editReceipt(String username, Receipt receipt) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        if (receipt.getTotal() == null) {
            receipt.setTotal(new BigDecimal(0.00));
        }
        if (receipt.getTotal() == null) {
            receipt.setTax(new BigDecimal(0.00));
        }

        try {
            String sql;

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("receiptid", receipt.getId());
            parameters.put("title", receipt.getTitle());
            parameters.put("vendor", receipt.getVendor());
            parameters.put("description", receipt.getDescription());
            parameters.put("date", receipt.getDate());
            parameters.put("tax", receipt.getTax());
            parameters.put("total", receipt.getTotal());

            //Don't update receipt image if image is null
            sql = "UPDATE RECEIPT " +
                        "SET Title = :title, Vendor = :vendor, Description = :description, Date = :date, Tax = :tax, Total = :total " +
                        "WHERE ReceiptId = :receiptid";
            this.jdbcTemplate.update(sql, parameters);

            //Remove old labels from RECEIPT_LABELS
            Map<String, Object> removeLabelParameters = new HashMap<>();
            removeLabelParameters.put("receiptid", receipt.getId());
            removeLabelParameters.put("username", username);
            String removeLabelSql = "DELETE FROM RECEIPT_LABELS " +
                    "WHERE ReceiptId = :receiptid " +
                    "AND Username = :username";
            this.jdbcTemplate.update(removeLabelSql, removeLabelParameters);

            //Insert new labels into RECEIPT_LABELS
            Map<String, ?>[] batchParams = getLabelBatchParams(username, receipt);
            String batchSql = "INSERT INTO RECEIPT_LABELS " +
                    "VALUES (:receiptid, :username, :labelname)";
            this.jdbcTemplate.batchUpdate(batchSql, batchParams);

            //Remove old items from RECEIPT_ITEMS
            Map<String, Object> removeItemParameters = new HashMap<>();
            removeItemParameters.put("receiptid", receipt.getId());
            String removeItemSql = "DELETE FROM RECEIPT_ITEM " +
                    "WHERE ReceiptId = :receiptid";
            this.jdbcTemplate.update(removeItemSql, removeItemParameters);

            //Insert new items into RECEIPT_ITEMS
            Map<String, ?>[] receiptItemBatchParams = getReceiptItemBatchParams(receipt);
            if (receiptItemBatchParams != null) {
                String receiptItemSql = "INSERT INTO RECEIPT_ITEM " +
                        "VALUES (:receiptid, :itemnumber, :name, :quantity, :unitprice, :warrantylength, :warrantylengthunit)";
                this.jdbcTemplate.batchUpdate(receiptItemSql, receiptItemBatchParams);
            }

            transactionManager.commit(status);
        } catch (DataAccessException e) {
            logger.error("Unable to edit receipt in database. Error: " + e.getMessage());
            transactionManager.rollback(status);
            throw e;
        }
    }

    public Receipt getReceipt(String username, int receiptId) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        Receipt userReceipt = null;

        try {
            SqlParameterSource parameters = new MapSqlParameterSource("receiptid", receiptId).addValue("username", username);
            String query = "SELECT RECEIPT.ReceiptId, Vendor, Title, Description, Date, Tax, Total, OriginalFileName " +
                    "FROM USER_RECEIPTS " +
                    "INNER JOIN RECEIPT " +
                    "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                    "WHERE RECEIPT.ReceiptId = :receiptid " +
                    "AND USER_RECEIPTS.Username = :username";

            userReceipt = this.jdbcTemplate.queryForObject(query, parameters, new ReceiptRowMapper());

            //Get associated labels for receipt
            String labelQuery = "SELECT LabelName " +
                    "FROM RECEIPT " +
                    "INNER JOIN RECEIPT_LABELS " +
                    "ON RECEIPT.ReceiptId = RECEIPT_LABELS.ReceiptId " +
                    "WHERE Receipt.ReceiptId = :receiptid ";

            List<Label> labelNames = this.jdbcTemplate.query(labelQuery, parameters, new RowMapper<Label>() {
                public Label mapRow(ResultSet rs, int rowNum) throws SQLException {
                    Label newLabel = new Label();
                    newLabel.setName(rs.getString("LabelName"));
                    return newLabel;
                }
            });

            //Get associated items for receipt
            String itemQuery = "SELECT ItemNumber, Name, Quantity, UnitPrice, WarrantyLength, WarrantyLengthUnit " +
                    "FROM RECEIPT_ITEM " +
                    "WHERE ReceiptId = :receiptid ";

            List<ReceiptItem> receiptItems = this.jdbcTemplate.query(itemQuery, parameters, new RowMapper<ReceiptItem>() {
                public ReceiptItem mapRow(ResultSet rs, int rowNum) throws SQLException {
                    ReceiptItem item = new ReceiptItem();
                    item.setItemNumber(rs.getInt(1));
                    item.setName(rs.getString(2));
                    item.setQuantity(rs.getInt(3));
                    item.setUnitPrice(rs.getBigDecimal(4));
                    item.setWarrantyLength(rs.getInt(5));
                    item.setWarrantyUnit(rs.getString(6));
                    return item;
                }
            });

            if (userReceipt != null) {
                //Add labels and items to receipt.
                userReceipt.setLabels(labelNames);
                userReceipt.setItems(receiptItems);
            }

            transactionManager.commit(status);
        } catch (DataAccessException e) {
            logger.error("Unable to get User: " + username + "'s receipt with id: " + receiptId);
            logger.error("Unable to fetch user receipt from database. Error: " + e.getMessage());
            transactionManager.rollback(status);
        }

        return userReceipt;
    }

    public ReceiptFile getReceiptFile(String username, int receiptId) {
        ReceiptFile receiptFile = null;

        try {
            SqlParameterSource parameters = new MapSqlParameterSource("receiptid", receiptId).addValue("username", username);
            //Selects the originalfile column if not null, or the image column if originalfile is null
            String query = "SELECT RECEIPT.ReceiptId, ISNULL(OriginalFile, FullImage), ISNULL(OriginalFileMIME, MIME) " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "WHERE Receipt.ReceiptId = :receiptid " +
                        "AND USER_RECEIPTS.Username = :username";

            receiptFile = this.jdbcTemplate.queryForObject(query, parameters, new ReceiptFileRowMapper());
        } catch (DataAccessException e) {
            logger.error("Unable to fetch user receipt from database. Error: " + e.getMessage());
        }

        return receiptFile;
    }

    public ReceiptFile getReceiptThumbnail(String username, int receiptId) {
        ReceiptFile receiptFile = null;

        try {
            SqlParameterSource parameters = new MapSqlParameterSource("receiptid", receiptId).addValue("username", username);
            //Selects the originalfile column if not null, or the image column if originalfile is null
            String query = "SELECT RECEIPT.ReceiptId, ImageThumbnail, MIME " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "WHERE Receipt.ReceiptId = :receiptid " +
                        "AND USER_RECEIPTS.Username = :username";

            receiptFile = this.jdbcTemplate.queryForObject(query, parameters, new ReceiptFileThumbnailRowMapper());
        } catch (DataAccessException e) {
            logger.error("Unable to fetch user receipt from database. Error: " + e.getMessage());
        }

        return receiptFile;
    }

    public ReceiptsPage getRangeUserReceipts(String username, String searchQuery, List<String> labelNames, int start, int numRows) {
        ReceiptsPage receiptsPage = null;
        if (searchQuery.equals("")) {
            StringBuilder temp = new StringBuilder(searchQuery);
            temp.insert(0, '%');
            temp.append('%');
            searchQuery = temp.toString();
        }
        if (labelNames.size() == 0) {
            labelNames.add("All Receipts");
        }

        try {
            //Get all user receipts
            SqlParameterSource parameters = new MapSqlParameterSource("username", username)
                .addValue("searchQuery", searchQuery)
                .addValue("startrow", start)
                .addValue("numrows", numRows)
                .addValue("labelnames", labelNames)
                .addValue("labelnameslength", labelNames.size());

            String sqlQuery = "SELECT TOP_RECEIPTS.ReceiptId, LabelName, Title, Vendor, Description, OriginalFileName, Date, Tax, Total, ItemNumber, Name, Quantity, UnitPrice, WarrantyLength, WarrantyLengthUnit, ReceiptCount " +
                    "FROM (SELECT DISTINCT RECEIPT.ReceiptId, LabelName, Title, Vendor, Description, OriginalFileName, Date, Tax, Total, ReceiptCount = COUNT(*) OVER() " +
                    "                    FROM USER_RECEIPTS " +
                    "                    INNER JOIN RECEIPT " +
                    "                    LEFT JOIN RECEIPT_LABELS " +
                    "                    ON RECEIPT.ReceiptId = RECEIPT_LABELS.ReceiptId " +
                    "                    ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                    "                    LEFT OUTER JOIN RECEIPT_ITEM " +
                    "                    ON RECEIPT.ReceiptId = RECEIPT_ITEM.ReceiptId " +
                    "                    WHERE USER_RECEIPTS.Username = :username AND (COALESCE(RECEIPT.Title, '<NULL>') LIKE :searchQuery OR COALESCE(RECEIPT_ITEM.Name, '<NULL>') LIKE :searchQuery) AND RECEIPT.Title LIKE :searchQuery OR RECEIPT_ITEM.Name LIKE :searchQuery " +
                    "                    GROUP BY RECEIPT.ReceiptId, Title, LabelName, Vendor, Description, OriginalFileName, Date, Tax, Total " +
                    "                    HAVING SUM(" +
                    "                    CASE " +
                    "                       WHEN LabelName IN (:labelnames) OR 'All Receipts' IN (:labelnames) THEN 1 " +
                    "                       ELSE 0 " +
                    "                    END) >= :labelnameslength "+
                    "                    ORDER BY RECEIPT.Title " +
                    "                    OFFSET :startrow ROWS " +
                    "                    FETCH NEXT :numrows ROWS ONLY) AS TOP_RECEIPTS " +
                    "LEFT OUTER JOIN RECEIPT_ITEM " +
                    "ON TOP_RECEIPTS.ReceiptId = RECEIPT_ITEM.ReceiptId " +
                    "ORDER BY TOP_RECEIPTS.Title";

            receiptsPage = this.jdbcTemplate.query(sqlQuery, parameters, new ReceiptsPageResultSetExtractor());
        } catch(DataAccessException e) {
            logger.error("Unable to fetch user receipts from the database: " + e.getMessage());
            throw e;
        }

        return receiptsPage;
    }

    /*
    Private helper methods
     */

    @SuppressWarnings("unchecked")
    private Map<String, ?>[] getLabelBatchParams(String username, Receipt receipt) {
        Map<String, ?>[] batchParams = null;
        if (receipt.getLabels() != null) {
            batchParams = new HashMap[receipt.getLabels().size()];
            for (int i = 0; i < receipt.getLabels().size(); i++) {
                Map<String, Object> temp = new HashMap<>();
                temp.put("receiptid", receipt.getId());
                temp.put("username", username);
                temp.put("labelname", receipt.getLabels().get(i));
                batchParams[i] = temp;
            }
        } else {
            batchParams = new HashMap[0];
        }

        return batchParams;
    }

    @SuppressWarnings("unchecked")
    private Map<String, ?>[] getReceiptItemBatchParams(Receipt receipt) {
        Map<String, ?>[] batchParams = null;
        if (receipt.getItems() != null) {
            batchParams = new HashMap[receipt.getItems().size()];
            for (int i = 0; i < receipt.getItems().size(); i++) {
                List<ReceiptItem> items = receipt.getItems();
                Map<String, Object> temp = new HashMap<>();
                temp.put("receiptid", receipt.getId());
                temp.put("itemnumber", i);
                temp.put("name", items.get(i).getName());
                temp.put("quantity", items.get(i).getQuantity());
                temp.put("unitprice", items.get(i).getUnitPrice());
                temp.put("warrantylength", items.get(i).getWarrantyLength());
                temp.put("warrantylengthunit", items.get(i).getWarrantyUnit());
                batchParams[i] = temp;
            }
        } else {
            batchParams = new HashMap[0];
        }

        return batchParams;
    }
}
