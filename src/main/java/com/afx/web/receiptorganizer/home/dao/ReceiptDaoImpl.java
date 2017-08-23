package com.afx.web.receiptorganizer.home.dao;

import com.afx.web.receiptorganizer.home.types.Receipt;
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
            String sql = "INSERT INTO [ReceiptOrganizer].[dbo].[RECEIPT] " +
                    "VALUES (:title, :description, :date, :receiptAmount, :numItems, :file)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            this.jdbcTemplate.update(sql, new BeanPropertySqlParameterSource(receipt), keyHolder);

            //Insert into USER_RECEIPTS
            Map<String, Object> userReceiptParameters = new HashMap<>();
            userReceiptParameters.put("username", username);
            userReceiptParameters.put("receiptid", keyHolder.getKey().intValue());
            String userReceiptsSql = "INSERT INTO [ReceiptOrganizer].[dbo].[USER_RECEIPTS] " +
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
            String batchSql = "INSERT INTO [ReceiptOrganizer].[dbo].[RECEIPT_LABELS] " +
                    "VALUES (:receiptid, :username, :labelname)";
            this.jdbcTemplate.batchUpdate(batchSql, batchParams);
            transactionManager.commit(status);
        } catch (DataAccessException e) {
            logger.error("Unable to add receipt to database. Error: " + e.getMessage());
            transactionManager.rollback(status);
            throw e;
        }
    }

    public void deleteReceipt(String username, Receipt receipt) {

    }

    public void editReceipt(String username, Receipt receipt) {

    }

    public List<Receipt> getAllUserReceipts(String username) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        List<Receipt> userReceipts;

        try {
            SqlParameterSource parameters = new MapSqlParameterSource("username", username);
            String query = "SELECT * " +
                    "FROM [ReceiptOrganizer].[dbo].[USER_RECEIPTS] " +
                    "INNER JOIN [ReceiptOrganizer].[dbo].[RECEIPT] " +
                    "ON [USER_RECEIPTS].[ReceiptId] = [RECEIPT].[ReceiptId]" +
                    "WHERE [Username] = :username ";
            userReceipts = this.jdbcTemplate.query(query, parameters, new RowMapper<Receipt>() {
                public Receipt mapRow(ResultSet rs, int rowNum) throws SQLException {
                    Receipt receipt = new Receipt();
                    receipt.setTitle(rs.getString("Title"));
                    receipt.setDescription(rs.getString("Description"));
                    receipt.setDate(rs.getDate("Date"));
                    receipt.setReceiptAmount(rs.getFloat("ReceiptAmount"));
                    receipt.setNumItems(rs.getInt("NumItems"));
                    receipt.setFile(rs.getBytes("Image"));
                    return receipt;
                }
            });

            transactionManager.commit(status);
        } catch (DataAccessException e) {
            logger.error("Unable to fetch user receipts from database. Error: " + e.getMessage());
            transactionManager.rollback(status);
            throw e;
        }

        return userReceipts;
    }

    public List<Receipt> getUserReceiptsForLabel(String username) {
        return null;
    }
}
