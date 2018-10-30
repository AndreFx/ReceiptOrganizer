package com.afx.web.receiptorganizer.dao.receipt;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.afx.web.receiptorganizer.types.Receipt;
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
                    "VALUES (:title, :vendor, :description, :date, :tax, :total, :file, :thumbnail, " +
                    ":originalFile, :fileName, :MIME, :originalMIME)";
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
            parameters.put("description", receipt.getDescription());
            parameters.put("date", receipt.getDate());
            parameters.put("tax", receipt.getTax());
            parameters.put("total", receipt.getTotal());

            //Don't update receipt image if image is null
            sql = "UPDATE RECEIPT " +
                        "SET Title = :title, Description = :description, Date = :date, Tax = :tax, Total = :total " +
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
            String query = "SELECT RECEIPT.ReceiptId, Title, Description, Date, Tax, Total, OriginalFileName, OriginalFile, FullImage, ImageThumbnail, MIME, OriginalFileMIME " +
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

            List<String> labelNames = this.jdbcTemplate.query(labelQuery, parameters, new RowMapper<String>() {
                public String mapRow(ResultSet rs, int rowNum) throws SQLException {
                    return rs.getString("LabelName");
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
                userReceipt.setLabels(labelNames.toArray(new String[labelNames.size()]));
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

    public int getTotalNumUserReceiptsFromString(String username, String searchString) {
        Integer result;

        try {
            //Get all user receipts
            SqlParameterSource parameters = new MapSqlParameterSource("username", username).addValue("searchstring", searchString);
            String countQuery = "SELECT COUNT(DISTINCT RECEIPT.ReceiptId) As Count " +
                    "FROM USER_RECEIPTS " +
                    "INNER JOIN RECEIPT " +
                    "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                    "LEFT OUTER JOIN RECEIPT_ITEM " +
                    "ON RECEIPT.ReceiptId = RECEIPT_ITEM.ReceiptId " +
                    "WHERE Username = :username AND RECEIPT.Title LIKE :searchstring OR RECEIPT_ITEM.Name LIKE :searchstring ";
            result = this.jdbcTemplate.queryForObject(countQuery, parameters, new ReceiptCountRowMapper());
        } catch (DataAccessException e) {
            logger.error("Unable to get result size of search: " + e.getMessage());
            throw e;
        }

        if (result == null) {
            result = 0;
        }
        return result;
    }

    public int getTotalNumUserReceiptsForLabels(String username, List<String> labelNames) {
        Integer result;

        try {
            SqlParameterSource parameters;
            String countQuery;

            if (labelNames.size() == 0) {
                //Get all user receipts
                parameters = new MapSqlParameterSource("username", username);
                countQuery = "SELECT Count(*) AS Count " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "WHERE Username = :username ";
            } else {
                //Get receipts for specific labels
                parameters = new MapSqlParameterSource("username", username)
                        .addValue("labelnames", labelNames)
                        .addValue("labelnameslength", labelNames.size());
                countQuery = "SELECT COUNT(RECEIPT_RESULTS.ReceiptId) AS Count " +
                        "FROM (SELECT DISTINCT RECEIPT.ReceiptId As ReceiptId " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "INNER JOIN RECEIPT_LABELS " +
                        "ON RECEIPT.ReceiptId = RECEIPT_LABELS.ReceiptId " +
                        "GROUP BY RECEIPT.ReceiptId " +
                        "HAVING SUM(" +
                        "   CASE " +
                        "       WHEN LabelName IN (:labelnames) THEN 1 " +
                        "       ELSE 0 " +
                        "   END) >= :labelnameslength) AS RECEIPT_RESULTS ";
            }
            result = this.jdbcTemplate.queryForObject(countQuery, parameters, new ReceiptCountRowMapper());
        } catch(DataAccessException e) {
            logger.error("Unable to get result size of search: " + e.getMessage());
            throw e;
        }

        if (result == null) {
            result = 0;
        }
        return result;
    }

    public List<Receipt> findRangeUserReceiptsFromString(String username, String searchString, int start, int numRows) {
        List<Receipt> receipts;

        try {
            //Get all user receipts
            SqlParameterSource parameters = new MapSqlParameterSource("username", username).addValue("searchstring", searchString)
                    .addValue("startrow", start).addValue("numrows", numRows);

            String query = "SELECT TOP_RECEIPTS.ReceiptId, Title, Date, Total, Name, Quantity, UnitPrice " +
                    "FROM (SELECT DISTINCT RECEIPT.ReceiptId, Title, Date, Total " +
                    "                    FROM USER_RECEIPTS " +
                    "                    INNER JOIN RECEIPT " +
                    "                    ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                    "                    LEFT OUTER JOIN RECEIPT_ITEM " +
                    "                    ON RECEIPT.ReceiptId = RECEIPT_ITEM.ReceiptId " +
                    "                    WHERE Username = :username AND RECEIPT.Title LIKE :searchstring OR RECEIPT_ITEM.Name LIKE :searchstring " +
                    "                    ORDER BY RECEIPT.Title " +
                    "                    OFFSET :startrow ROWS " +
                    "                    FETCH NEXT :numrows ROWS ONLY) AS TOP_RECEIPTS " +
                    "LEFT OUTER JOIN RECEIPT_ITEM " +
                    "ON TOP_RECEIPTS.ReceiptId = RECEIPT_ITEM.ReceiptId " +
                    "ORDER BY TOP_RECEIPTS.Title";

            receipts = this.jdbcTemplate.query(query, parameters, new ReceiptResultSetExtractor());
        } catch(DataAccessException e) {
            logger.error("Unable to search database for searchString: " + e.getMessage());
            throw e;
        }

        return receipts;
    }

    public List<Receipt> getRangeUserReceiptsForLabels(String username, List<String> labelNames, int start, int numRows) {
        List<Receipt> receipts;

        try {
            SqlParameterSource parameters;
            String query;
            if (labelNames.size() == 0) {
                //Get all user receipts
                parameters = new MapSqlParameterSource("username", username)
                        .addValue("startrow", start)
                        .addValue("numrows", numRows);
                query = "SELECT TOP_RECEIPTS.ReceiptId " +
                        "FROM (SELECT DISTINCT RECEIPT.ReceiptId " +
                        "                    FROM USER_RECEIPTS " +
                        "                    INNER JOIN RECEIPT " +
                        "                    ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "                    WHERE Username = :username " +
                        "                    ORDER BY RECEIPT.ReceiptId " +
                        "                    OFFSET :startrow ROWS " +
                        "                    FETCH NEXT :numrows ROWS ONLY) AS TOP_RECEIPTS " +
                        "ORDER BY TOP_RECEIPTS.ReceiptId";
            } else {
                //Get receipts for specific label
                parameters = new MapSqlParameterSource("username", username)
                        .addValue("labelnames", labelNames)
                        .addValue("labelnameslength", labelNames.size())
                        .addValue("startrow", start)
                        .addValue("numrows", numRows);
                query = "SELECT TOP_RECEIPTS.ReceiptId" +
                        "FROM (SELECT DISTINCT RECEIPT.ReceiptId, Title, Date, Total " +
                        "                    FROM USER_RECEIPTS " +
                        "                    INNER JOIN RECEIPT " +
                        "                    ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "                    INNER JOIN RECEIPT_LABELS " +
                        "                    ON RECEIPT.ReceiptId = RECEIPT_LABELS.ReceiptId " +
                        "                    WHERE RECEIPT_LABELS.Username = :username " +
                        "                    GROUP BY RECEIPT.ReceiptId, Title, Date, Total " +
                        "                    HAVING SUM(" +
                        "                    CASE " +
                        "                       WHEN LabelName IN (:labelnames) THEN 1 " +
                        "                       ELSE 0 " +
                        "                    END) >= :labelnameslength "+
                        "                    ORDER BY RECEIPT.Title " +
                        "                    OFFSET :startrow ROWS " +
                        "                    FETCH NEXT :numrows ROWS ONLY) AS TOP_RECEIPTS " +
                        "ORDER BY TOP_RECEIPTS.ReceiptId";
            }

            receipts = this.jdbcTemplate.query(query, parameters, new ReceiptResultSetExtractor());
        } catch (DataAccessException e) {
            logger.error("Unable to fetch user receipts from database. Error: " + e.getMessage());
            throw e;
        }

        return receipts;
    }

    /*
    Private helper methods
     */

    @SuppressWarnings("unchecked")
    private Map<String, ?>[] getLabelBatchParams(String username, Receipt receipt) {
        Map<String, ?>[] batchParams = null;
        if (receipt.getLabels() != null) {
            batchParams = new HashMap[receipt.getLabels().length];
            for (int i = 0; i < receipt.getLabels().length; i++) {
                Map<String, Object> temp = new HashMap<>();
                temp.put("receiptid", receipt.getId());
                temp.put("username", username);
                temp.put("labelname", receipt.getLabels()[i]);
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
