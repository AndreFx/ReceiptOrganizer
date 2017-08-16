package com.afx.web.receiptorganizer.login.dao;

import com.afx.web.receiptorganizer.login.types.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;


@Repository
@Qualifier("userDao")
public class UserDaoImpl implements UserDao {

    private static Logger logger = LogManager.getLogger(UserDaoImpl.class);

    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    public boolean isUser(String username) {
        String user = "";
        try {
            SqlParameterSource parameters = new MapSqlParameterSource("username", username);
            String query = "SELECT [Username] " +
                    "FROM [ReceiptOrganizer].[dbo].[USER] " +
                    "WHERE [Username] = :username";
            user = this.jdbcTemplate.queryForObject(query, parameters, String.class);
        } catch (EmptyResultDataAccessException e) {
            logger.info("Username not found, new user logging in.");
        }

        return !user.equals("");
    }

    public void add(User user) {
        Map<String, String> parameters = new HashMap<>();
        parameters.put("username", user.getUsername());
        parameters.put("fName", user.getfName());
        parameters.put("lName", user.getlName());

        String sql = "INSERT INTO [ReceiptOrganizer].[dbo].[USER]" +
                "VALUES (:username, :fName, :lName)";
        this.jdbcTemplate.update(sql, parameters);

        logger.info("New user: " + user.getUsername() + " added to database.");
    }
}
