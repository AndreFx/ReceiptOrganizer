package com.afx.web.receiptorganizer.home.dao;

import com.afx.web.receiptorganizer.home.types.Label;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@Qualifier("categoryDao")
public class LabelDaoImpl implements LabelDao {

    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    public void addLabel(String username, Label label) {
        //Add category to USER_CATEGORIES table.
        Map<String, String> parameters = new HashMap<>();
        parameters.put("username", username);
        parameters.put("labelName", label.getName());
        String sql = "INSERT INTO USER_LABELS " +
                "VALUES (:username, :labelName)";
        this.jdbcTemplate.update(sql, parameters);
    }

    public void deleteLabel(Label label) {

    }

    public void editLabel(Label label) {

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
}
