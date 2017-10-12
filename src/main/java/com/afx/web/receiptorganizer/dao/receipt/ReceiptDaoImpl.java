package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.Receipt;
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

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@Qualifier("receiptDao")
public class ReceiptDaoImpl implements ReceiptDao {

    //TODO Make sure all of these require usernames to update sql.
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

        try {
            //Insert into RECEIPT table first.
            String sql = "INSERT INTO RECEIPT " +
                    "VALUES (:title, :description, :date, :receiptAmount, :numItems, :file, :receiptThumbnail)";
            KeyHolder keyHolder = new GeneratedKeyHolder();

            //BeanPropertySqlParameterSource uses reflection to map the fields to the params, make sure no other object
            //has fields with the same name as receipt.
            this.jdbcTemplate.update(sql, new BeanPropertySqlParameterSource(receipt), keyHolder);

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

        try {
            Map<String, Object> parameters = new HashMap<>();
            String sql;
            parameters.put("receiptid", receipt.getReceiptId());
            parameters.put("title", receipt.getTitle());
            parameters.put("description", receipt.getDescription());
            parameters.put("date", receipt.getDate());
            parameters.put("receiptamount", receipt.getReceiptAmount());
            parameters.put("numitems", receipt.getNumItems());

            //Don't update receipt image if image is null
            if (receipt.getFile() == null) {
                sql = "UPDATE RECEIPT " +
                        "SET Title = :title, Description = :description, Date = :date, ReceiptAmount = :receiptamount, NumItems = :numitems " +
                        "WHERE ReceiptId = :receiptid";
            } else {
                parameters.put("image", receipt.getFile());
                parameters.put("thumbnail", receipt.getReceiptThumbnail());
                sql = "UPDATE RECEIPT " +
                        "SET Title = :title, Description = :description, Date = :date, ReceiptAmount = :receiptamount, NumItems = :numitems, Image = :image, ImageThumbnail = :thumbnail " +
                        "WHERE ReceiptId = :receiptid";
            }
            this.jdbcTemplate.update(sql, parameters);

            //Insert into RECEIPT_LABELS
            Map<String, ?>[] batchParams = getLabelBatchParams(username, receipt);
            String batchSql = "IF NOT EXISTS (SELECT * FROM RECEIPT_LABELS WHERE ReceiptId = :receiptid AND Username = :username AND LabelName = :labelname) BEGIN " +
                    "INSERT INTO RECEIPT_LABELS " +
                    "VALUES (:receiptid, :username, :labelname) END";
            this.jdbcTemplate.batchUpdate(batchSql, batchParams);
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
            String query = "SELECT RECEIPT.ReceiptId, Title, Description, Date, ReceiptAmount, NumItems " +
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

            if (userReceipt != null) {
                //Add labels to receipt.
                userReceipt.setLabels(labelNames.toArray(new String[labelNames.size()]));
            }

            transactionManager.commit(status);
        } catch (DataAccessException e) {
            logger.error("Unable to get User: " + username + "'s receipt with id: " + receiptId);
            logger.error("Unable to fetch user receipt from database. Error: " + e.getMessage());
            transactionManager.rollback(status);
        }

        return userReceipt;
    }

    public byte[] getReceiptImage(String username, int receiptId, boolean thumbnail) {
        byte[] receiptImage = null;

        try {
            SqlParameterSource parameters = new MapSqlParameterSource("receiptid", receiptId).addValue("username", username);
            String query;

            if (thumbnail) {
                query = "SELECT RECEIPT.ReceiptId, ImageThumbnail " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "WHERE Receipt.ReceiptId = :receiptid " +
                        "AND USER_RECEIPTS.Username = :username";
            } else {
                query = "SELECT RECEIPT.ReceiptId, Image " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "WHERE Receipt.ReceiptId = :receiptid " +
                        "AND USER_RECEIPTS.Username = :username";
            }

            receiptImage = this.jdbcTemplate.queryForObject(query, parameters, new ReceiptImageRowMapper()).getReceiptImage();
        } catch (DataAccessException e) {
            logger.error("Unable to fetch user receipt from database. Error: " + e.getMessage());
        }

        return receiptImage;
    }

    public int getTotalNumUserReceiptsFromString(String username, String searchString) {
        int result;

        try {
            //Get all user receipts
            SqlParameterSource parameters = new MapSqlParameterSource("username", username).addValue("searchstring", searchString);
            String countQuery = "SELECT COUNT(*) As Count " +
                    "FROM USER_RECEIPTS " +
                    "INNER JOIN RECEIPT " +
                    "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                    "WHERE Username = :username AND RECEIPT.Title LIKE :searchstring ";
            result = this.jdbcTemplate.queryForObject(countQuery, parameters, new ReceiptCountRowMapper());
        } catch (DataAccessException e) {
            logger.error("Unable to get result size of search: " + e.getMessage());
            throw e;
        }

        return result;
    }

    public int getTotalNumUserReceiptsForLabel(String username, String label) {
        int result;

        try {
            SqlParameterSource parameters;
            String countQuery;

            if (label == null) {
                //Get all user receipts
                parameters = new MapSqlParameterSource("username", username);
                countQuery = "SELECT Count(*) As Count " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "WHERE Username = :username ";
            } else {
                //Get receipts for specifc label
                parameters = new MapSqlParameterSource("username", username).addValue("labelname", label);
                countQuery = "SELECT COUNT(*) As Count " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.[ReceiptId] " +
                        "INNER JOIN RECEIPT_LABELS " +
                        "ON RECEIPT.ReceiptId = RECEIPT_LABELS.ReceiptId " +
                        "WHERE RECEIPT_LABELS.Username = :username " +
                        "AND LabelName = :labelname ";
            }
            result = this.jdbcTemplate.queryForObject(countQuery, parameters, new ReceiptCountRowMapper());
        } catch(DataAccessException e) {
            logger.error("Unable to get result size of search: " + e.getMessage());
            throw e;
        }

        return result;
    }

    public List<Receipt> findRangeUserReceiptsFromString(String username, String searchString, int start, int numRows) {
        List<Receipt> receipts;

        try {
            //Get all user receipts
            SqlParameterSource parameters = new MapSqlParameterSource("username", username).addValue("searchstring", searchString)
                    .addValue("startrow", start).addValue("numrows", numRows);
            String query = "SELECT RECEIPT.ReceiptId, Title, Description, Date, ReceiptAmount, NumItems  " +
                    "FROM USER_RECEIPTS " +
                    "INNER JOIN RECEIPT " +
                    "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                    "WHERE Username = :username AND RECEIPT.Title LIKE :searchstring " +
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

    public List<Receipt> getRangeUserReceiptsForLabel(String username, String label, int start, int numRows) {
        List<Receipt> receipts;

        try {
            SqlParameterSource parameters;
            String query;
            if (label == null) {
                //Get all user receipts
                parameters = new MapSqlParameterSource("username", username)
                        .addValue("startrow", start).addValue("numrows", numRows);
                query = "SELECT RECEIPT.ReceiptId, Title, Description, Date, ReceiptAmount, NumItems  " +
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
                        .addValue("labelname", label).addValue("startrow", start)
                        .addValue("numrows", numRows);
                query = "SELECT RECEIPT.ReceiptId, Title, Description, Date, ReceiptAmount, NumItems  " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.[ReceiptId] " +
                        "INNER JOIN RECEIPT_LABELS " +
                        "ON RECEIPT.ReceiptId = RECEIPT_LABELS.ReceiptId " +
                        "WHERE RECEIPT_LABELS.Username = :username " +
                        "AND LabelName = :labelname " +
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
    Private static helper methods
     */

    @SuppressWarnings("unchecked")
    private static Map<String, ?>[] getLabelBatchParams(String username, Receipt receipt) {
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
}
