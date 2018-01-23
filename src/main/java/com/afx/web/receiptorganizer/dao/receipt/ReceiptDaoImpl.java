package com.afx.web.receiptorganizer.dao.receipt;

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

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @SuppressWarnings("unchecked")
    public void addReceipt(String username, Receipt receipt) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        if (receipt.getReceiptAmount() == null) {
            receipt.setReceiptAmount(new BigDecimal(0.00));
        }

        try {
            //Insert into RECEIPT table first.
            String sql = "INSERT INTO RECEIPT " +
                    "VALUES (:title, :description, :date, :receiptAmount, :receiptFullImage, :receiptThumbnail, " +
                    ":receiptPDF, :MIME)";
            KeyHolder keyHolder = new GeneratedKeyHolder();

            //BeanPropertySqlParameterSource uses reflection to map the fields to the params, make sure no other object
            //has fields with the same name as receipt.
            this.jdbcTemplate.update(sql, new BeanPropertySqlParameterSource(receipt), keyHolder);

            //Insert into RECEIPT_ITEM
            receipt.setReceiptId(keyHolder.getKey().intValue());
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
            receipt.setReceiptId(keyHolder.getKey().intValue());
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

        if (receipt.getReceiptAmount() == null) {
            receipt.setReceiptAmount(new BigDecimal(0.00));
        }

        try {
            String sql;

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("receiptid", receipt.getReceiptId());
            parameters.put("title", receipt.getTitle());
            parameters.put("description", receipt.getDescription());
            parameters.put("date", receipt.getDate());
            parameters.put("receiptamount", receipt.getReceiptAmount());

            //Don't update receipt image if image is null
            if (receipt.getReceiptFullImage() == null) {
                sql = "UPDATE RECEIPT " +
                        "SET Title = :title, Description = :description, Date = :date, ReceiptAmount = :receiptamount " +
                        "WHERE ReceiptId = :receiptid";
            } else {
                parameters.put("image", receipt.getReceiptFullImage());
                parameters.put("thumbnail", receipt.getReceiptThumbnail());
                if (receipt.getReceiptPDF() == null) {
                    sql = "UPDATE RECEIPT " +
                            "SET Title = :title, Description = :description, Date = :date, ReceiptAmount = :receiptamount, " +
                            "FullImage = :image, ImageThumbnail = :thumbnail " +
                            "WHERE ReceiptId = :receiptid";
                } else {
                    //File upload was a pdf
                    parameters.put("receiptPDF", receipt.getReceiptPDF());
                    parameters.put("MIME", "application/pdf");
                    sql = "UPDATE RECEIPT " +
                            "SET Title = :title, Description = :description, Date = :date, ReceiptAmount = :receiptamount, " +
                            "FullImage = :image, ImageThumbnail = :thumbnail, OriginalFile = :receiptPDF, " +
                            "OriginalFileMIME = :MIME " +
                            "WHERE ReceiptId = :receiptid";
                }
            }
            this.jdbcTemplate.update(sql, parameters);

            //Remove old labels from RECEIPT_LABELS
            Map<String, Object> removeLabelParameters = new HashMap<>();
            removeLabelParameters.put("receiptid", receipt.getReceiptId());
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
            removeItemParameters.put("receiptid", receipt.getReceiptId());
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
            logger.error("Unable to edit label in database. Error: " + e.getMessage());
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
            String query = "SELECT RECEIPT.ReceiptId, Title, Description, Date, ReceiptAmount " +
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

    public ReceiptFile getReceiptImage(String username, int receiptId, boolean thumbnail) {
        ReceiptFile receiptImage = null;

        try {
            SqlParameterSource parameters = new MapSqlParameterSource("receiptid", receiptId).addValue("username", username);
            String query;

            if (thumbnail) {
                query = "SELECT RECEIPT.ReceiptId, ImageThumbnail, OriginalFileMIME " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "WHERE Receipt.ReceiptId = :receiptid " +
                        "AND USER_RECEIPTS.Username = :username";
            } else {
                query = "SELECT RECEIPT.ReceiptId, FullImage, OriginalFileMIME " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "WHERE Receipt.ReceiptId = :receiptid " +
                        "AND USER_RECEIPTS.Username = :username";
            }

            receiptImage = this.jdbcTemplate.queryForObject(query, parameters, new ReceiptFileRowMapper());
        } catch (DataAccessException e) {
            logger.error("Unable to fetch user receipt from database. Error: " + e.getMessage());
        }

        return receiptImage;
    }

    public ReceiptFile getReceiptFile(String username, int receiptId) {
        ReceiptFile receiptFile = null;

        try {
            SqlParameterSource parameters = new MapSqlParameterSource("receiptid", receiptId).addValue("username", username);
            //Selects the originalfile column if not null, or the image column if originalfile is null
            String query = "SELECT RECEIPT.ReceiptId, ISNULL(OriginalFile, FullImage), OriginalFileMIME " +
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

    public int getTotalNumUserReceiptsFromString(String username, String searchString) {
        int result;

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

        return result;
    }

    public int getTotalNumUserReceiptsForLabels(String username, List<String> labels) {
        int result;

        try {
            SqlParameterSource parameters;
            String countQuery;

            if (labels.size() == 0) {
                //Get all user receipts
                parameters = new MapSqlParameterSource("username", username);
                countQuery = "SELECT Count(*) As Count " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "WHERE Username = :username ";
            } else {
                //Get receipts for specifc labels
                parameters = new MapSqlParameterSource("username", username).addValue("labelnames", labels);
                countQuery = "SELECT COUNT(DISTINCT RECEIPT.ReceiptId) As Count " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.[ReceiptId] " +
                        "INNER JOIN RECEIPT_LABELS " +
                        "ON RECEIPT.ReceiptId = RECEIPT_LABELS.ReceiptId " +
                        "WHERE RECEIPT_LABELS.Username = :username " +
                        "AND LabelName IN (:labelnames) ";
            }
            result = this.jdbcTemplate.queryForObject(countQuery, parameters, new ReceiptCountRowMapper());
        } catch(DataAccessException e) {
            logger.error("Unable to get result size of search: " + e.getMessage());
            throw e;
        }

        return result;
    }

    //TODO Add items to show on home screen.
    public List<Receipt> findRangeUserReceiptsFromString(String username, String searchString, int start, int numRows) {
        List<Receipt> receipts;

        try {
            //Get all user receipts
            SqlParameterSource parameters = new MapSqlParameterSource("username", username).addValue("searchstring", searchString)
                    .addValue("startrow", start).addValue("numrows", numRows);

            String query = "SELECT DISTINCT RECEIPT.ReceiptId, Title, Description, Date, ReceiptAmount " +
                    "FROM USER_RECEIPTS " +
                    "INNER JOIN RECEIPT " +
                    "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                    "LEFT OUTER JOIN RECEIPT_ITEM " +
                    "ON RECEIPT.ReceiptId = RECEIPT_ITEM.ReceiptId " +
                    "WHERE Username = :username AND RECEIPT.Title LIKE :searchstring OR RECEIPT_ITEM.Name LIKE :searchstring " +
                    "ORDER BY RECEIPT.Title " +
                    "OFFSET :startrow ROWS " +
                    "FETCH NEXT :numrows ROWS ONLY ";

            receipts = this.jdbcTemplate.query(query, parameters, new ReceiptRowMapper());
        } catch(DataAccessException e) {
            logger.error("Unable to search database for searchString: " + e.getMessage());
            throw e;
        }

        return receipts;
    }

    //TODO Add items to show on home screen.
    public List<Receipt> getRangeUserReceiptsForLabels(String username, List<String> labels, int start, int numRows) {
        List<Receipt> receipts;

        try {
            SqlParameterSource parameters;
            String query;
            if (labels.size() == 0) {
                //Get all user receipts
                parameters = new MapSqlParameterSource("username", username)
                        .addValue("startrow", start).addValue("numrows", numRows);
                query = "SELECT RECEIPT.ReceiptId, Title, Description, Date, ReceiptAmount  " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "WHERE Username = :username " +
                        "ORDER BY RECEIPT.Title " +
                        "OFFSET :startrow ROWS " +
                        "FETCH NEXT :numrows ROWS ONLY ";
            } else {
                //Get receipts for specifc label
                parameters = new MapSqlParameterSource("username", username)
                        .addValue("labelnames", labels).addValue("startrow", start)
                        .addValue("numrows", numRows);
                query = "SELECT DISTINCT RECEIPT.ReceiptId, Title, Description, Date, ReceiptAmount  " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.[ReceiptId] " +
                        "INNER JOIN RECEIPT_LABELS " +
                        "ON RECEIPT.ReceiptId = RECEIPT_LABELS.ReceiptId " +
                        "WHERE RECEIPT_LABELS.Username = :username " +
                        "AND LabelName IN (:labelnames) " +
                        "ORDER BY RECEIPT.Title " +
                        "OFFSET :startrow ROWS " +
                        "FETCH NEXT :numrows ROWS ONLY ";
            }

            receipts = this.jdbcTemplate.query(query, parameters, new ReceiptRowMapper());
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
        Map<String, ?>[] batchParams = new HashMap[receipt.getLabels().length];
        for (int i = 0; i < receipt.getLabels().length; i++) {
            Map<String, Object> temp = new HashMap<>();
            temp.put("receiptid", receipt.getReceiptId());
            temp.put("username", username);
            temp.put("labelname", receipt.getLabels()[i]);
            batchParams[i] = temp;
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
                temp.put("receiptid", receipt.getReceiptId());
                temp.put("itemnumber", i);
                temp.put("name", items.get(i).getName());
                temp.put("quantity", items.get(i).getQuantity());
                temp.put("unitprice", items.get(i).getUnitPrice());
                temp.put("warrantylength", items.get(i).getWarrantyLength());
                temp.put("warrantylengthunit", items.get(i).getWarrantyUnit());
                batchParams[i] = temp;
            }
        }

        return batchParams;
    }
}
