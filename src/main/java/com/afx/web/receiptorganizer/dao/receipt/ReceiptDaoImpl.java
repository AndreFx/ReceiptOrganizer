package com.afx.web.receiptorganizer.dao.receipt;

import com.afx.web.receiptorganizer.types.Receipt;
import org.apache.commons.codec.binary.Base64;
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

    private static Logger logger = LogManager.getLogger(ReceiptDaoImpl.class);

    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @SuppressWarnings("unchecked")
    public void addReceipt(String username, Receipt receipt) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        try {
            //Insert into RECEIPT table first.
            String sql = "INSERT INTO RECEIPT " +
                    "VALUES (:title, :description, :date, :receiptAmount, :numItems, :file)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            this.jdbcTemplate.update(sql, new BeanPropertySqlParameterSource(receipt), keyHolder);

            //Insert into USER_RECEIPTS
            Map<String, Object> userReceiptParameters = new HashMap<>();
            userReceiptParameters.put("username", username);
            userReceiptParameters.put("receiptid", keyHolder.getKey().intValue());
            String userReceiptsSql = "INSERT INTO USER_RECEIPTS " +
                    "VALUES (:username, :receiptid)";
            this.jdbcTemplate.update(userReceiptsSql, userReceiptParameters);

            //Insert into RECEIPT_LABELS
            Map<String, ?>[] batchParams = new HashMap[receipt.getLabels().length];
            for (int i = 0; i < receipt.getLabels().length; i++) {
                Map<String, Object> temp = new HashMap<>();
                temp.put("receiptid", keyHolder.getKey().intValue());
                temp.put("username", username);
                temp.put("labelname", receipt.getLabels()[i]);
                batchParams[i] = temp;
            }
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

    public void deleteReceipt(int receiptId) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        try {
            Map<String, Integer> parameters = new HashMap<>();
            parameters.put("receiptid", receiptId);
            String sql = "DELETE FROM RECEIPT " +
                    "WHERE ReceiptId = :receiptid";
            this.jdbcTemplate.update(sql, parameters);
            transactionManager.commit(status);
        } catch (DataAccessException e) {
            logger.error("Unable to delete receipt from database. Error: " + e.getMessage());
            transactionManager.rollback(status);
            throw e;
        }
    }

    public void editReceipt(String username, Receipt receipt) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        try {
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("receiptid", receipt.getReceiptId());
            parameters.put("title", receipt.getTitle());
            parameters.put("description", receipt.getDescription());
            parameters.put("date", receipt.getDate());
            parameters.put("receiptamount", receipt.getReceiptAmount());
            parameters.put("numitems", receipt.getNumItems());
            parameters.put("image", receipt.getFile());
            String sql = "UPDATE RECEIPT " +
                    "SET Title = :title, Description = :description, Date = :date, ReceiptAmount = :receiptamount, NumItems = :numitems, Image = :image " +
                    "WHERE ReceiptId = :receiptid";
            this.jdbcTemplate.update(sql, parameters);
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

        List<Receipt> receipts;

        try {
            SqlParameterSource parameters = new MapSqlParameterSource("receiptid", receiptId);
            String query = "SELECT * " +
                    "FROM RECEIPT " +
                    "WHERE Receipt.ReceiptId = :receiptid ";

            receipts = this.jdbcTemplate.query(query, parameters, new ReceiptRowMapper());

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

            if (receipts != null && receipts.size() != 0) {
                //Add labels to receipt.
                receipts.get(0).setLabels(labelNames.toArray(new String[labelNames.size()]));
            }

            transactionManager.commit(status);
        } catch (DataAccessException e) {
            logger.error("Unable to fetch user receipt from database. Error: " + e.getMessage());
            transactionManager.rollback(status);
            throw e;
        }

        if (receipts == null || receipts.size() == 0) {
            logger.error("Unable to get User:" + username+ " receipt: " + receiptId);
            return null;
        } else {
            return receipts.get(0);
        }
    }

    public List<Receipt> getUserReceiptsForLabel(String username, String label) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        List<Receipt> userReceipts;

        try {
            SqlParameterSource parameters;
            String query;
            if (label == null) {
                //Get all user receipts
                parameters = new MapSqlParameterSource("username", username);
                query = "SELECT * " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.ReceiptId " +
                        "WHERE Username = :username ";
            } else {
                //Get receipts for specifc label
                parameters = new MapSqlParameterSource("username", username)
                        .addValue("labelname", label);
                query = "SELECT * " +
                        "FROM USER_RECEIPTS " +
                        "INNER JOIN RECEIPT " +
                        "ON USER_RECEIPTS.ReceiptId = RECEIPT.[ReceiptId] " +
                        "INNER JOIN RECEIPT_LABELS " +
                        "ON RECEIPT.ReceiptId = RECEIPT_LABELS.ReceiptId " +
                        "WHERE RECEIPT_LABELS.Username = :username " +
                        "AND LabelName = :labelname ";
            }

            userReceipts = this.jdbcTemplate.query(query, parameters, new ReceiptRowMapper());

            transactionManager.commit(status);
        } catch (DataAccessException e) {
            logger.error("Unable to fetch user receipts from database. Error: " + e.getMessage());
            transactionManager.rollback(status);
            throw e;
        }

        return userReceipts;
    }
}
