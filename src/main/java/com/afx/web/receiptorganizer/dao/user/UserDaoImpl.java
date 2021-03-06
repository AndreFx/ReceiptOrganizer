package com.afx.web.receiptorganizer.dao.user;

import com.afx.web.receiptorganizer.dao.model.user.User;
import com.afx.web.receiptorganizer.dao.user.mapper.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;

@Repository
@Qualifier("userDao")
public class UserDaoImpl implements UserDao {

    /*
    Logger
     */

    private static Logger logger = LogManager.getLogger(UserDaoImpl.class);

    /*
    Private fields
     */

    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    /*
    Data access methods
     */

    public User getUser(String username) {
        User user;
        try {
            SqlParameterSource parameters = new MapSqlParameterSource("username", username);
            String query = "SELECT * " +
                    "FROM [USER] " +
                    "WHERE Username = :username";
            user = this.jdbcTemplate.queryForObject(query, parameters, new UserRowMapper());
        } catch (DataAccessException e) {
            logger.info("Unable to retrieve user: " + username + " information");
            throw e;
        }

        return user;
    }

    public void add(User user) {
        try {
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("username", user.getUsername());
            parameters.put("fName", user.getfName());
            parameters.put("lName", user.getlName());
            parameters.put("paginationsize", user.getPaginationSize());

            String sql = "INSERT INTO [USER] " +
                    "VALUES (:username, :fName, :lName, :paginationsize, NULL, NULL, NULL, NULL, NULL)";
            this.jdbcTemplate.update(sql, parameters);

            logger.info("New user: " + user.getUsername() + " added to database.");
        } catch(DataAccessException e) {
            logger.error("Unable to add new user: " + user.getUsername() + " to the database.");
            throw e;
        }
    }

    public void changeUserSettings(User user) {
        try {
            Map<String, Object> parameters = new HashMap<>();
            String sql;

            if (user.getUserPhoto().length != 0) {
                parameters.put("userimage", user.getUserPhoto());
                parameters.put("userimagemime", user.getUserPhotoMIME());
                parameters.put("userthumbnail", user.getUserPhotoThumbnail());
                parameters.put("userthumbnailmime", user.getUserPhotoThumbnailMIME());
                sql = "UPDATE [USER] " +
                        "SET UserPhoto = :userimage, PaginationSize = :paginationsize, fName = :fname, lName = :lname, UserPhotoThumbnail = :userthumbnail, UserPhotoMIME = :userimagemime, UserPhotoThumbnailMIME = :userthumbnailmime " +
                        "WHERE Username = :username";
            } else {
                sql = "UPDATE [USER] " +
                        "SET PaginationSize = :paginationsize, fName = :fname, lName = :lname " +
                        "WHERE Username = :username";
            }
            parameters.put("username", user.getUsername());
            parameters.put("paginationsize", user.getPaginationSize());
            parameters.put("fname", user.getfName());
            parameters.put("lname", user.getlName());

            this.jdbcTemplate.update(sql, parameters);

            logger.info("User: " + user.getUsername() + " changed their settings");
        } catch(DataAccessException e) {
            logger.error("Unable to change user: " + user.getUsername() + " settings");
            throw e;
        }
    }
}
