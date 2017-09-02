package com.afx.web.receiptorganizer.dao.label;

import com.afx.web.receiptorganizer.dao.receipt.ReceiptDaoImpl;
import com.afx.web.receiptorganizer.types.Label;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
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
@Qualifier("categoryDao")
public class LabelDaoImpl implements LabelDao {

    private static Logger logger = LogManager.getLogger(ReceiptDaoImpl.class);

    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    @Autowired
    private PlatformTransactionManager transactionManager;

    public void addLabel(String username, Label label) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        try {
            //Add category to USER_CATEGORIES table.
            Map<String, String> parameters = new HashMap<>();
            parameters.put("username", username);
            parameters.put("labelName", label.getName());
            String sql = "INSERT INTO USER_LABELS " +
                    "VALUES (:username, :labelName)";
            this.jdbcTemplate.update(sql, parameters);
            transactionManager.commit(status);
        } catch (DataAccessException e) {
            logger.error("Unable to add label to database. Error: " + e.getMessage());
            transactionManager.rollback(status);
            throw e;
        }
    }

    public void deleteLabel(String username, Label label) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        try {
            Map<String, String> parameters = new HashMap<>();
            parameters.put("labelName", label.getName());
            parameters.put("username", username);
            String sql = "DELETE FROM USER_LABELS " +
                    "WHERE Username = :username AND LabelName = :labelName";
            this.jdbcTemplate.update(sql, parameters);
            transactionManager.commit(status);
        } catch (DataAccessException e) {
            logger.error("Unable to delete label from database. Error: " + e.getMessage());
            transactionManager.rollback(status);
            throw e;
        }
    }

    public void editLabel(String username, Label oldLabel, Label newLabel) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);

        try {
            Map<String, String> parameters = new HashMap<>();
            parameters.put("labelName", oldLabel.getName());
            parameters.put("newLabelName", newLabel.getName());
            parameters.put("username", username);
            String sql = "UPDATE USER_LABELS " +
                    "SET LabelName = :newLabelName " +
                    "WHERE Username = :username AND LabelName = :labelName";
            this.jdbcTemplate.update(sql, parameters);
            transactionManager.commit(status);
        } catch (DataAccessException e) {
            logger.error("Unable to edit label in database. Error: " + e.getMessage());
            transactionManager.rollback(status);
            throw e;
        }
    }

    //TODO Modify to return the number of receipts each label has.
    public List<Label> getAllUserLabels(String username) {
        SqlParameterSource parameters = new MapSqlParameterSource("username", username);
        String query = "SELECT LabelName " +
                "FROM USER_LABELS " +
                "WHERE Username = :username ";
        return this.jdbcTemplate.query(query, parameters, new RowMapper<Label>() {
            public Label mapRow(ResultSet rs, int rowNum) throws SQLException {
                Label label = new Label();
                label.setName(rs.getString("LabelName"));
                return label;
            }
        });
    }

    public boolean isLabelUnique(String username, Label label) {
        String labelName = "";
        try {
            Map<String, String> parameters = new HashMap<>();
            parameters.put("labelName", label.getName());
            parameters.put("username", username);
            String query = "SELECT LabelName " +
                    "FROM USER_LABELS " +
                    "WHERE Username = :username " +
                    "AND LabelName = :labelName";
            labelName = this.jdbcTemplate.queryForObject(query, parameters, String.class);
        } catch (EmptyResultDataAccessException e) {
            logger.info("User : " + username + " attempted to add a non-unique label.");
        }

        return !labelName.equals("");
    }
}
