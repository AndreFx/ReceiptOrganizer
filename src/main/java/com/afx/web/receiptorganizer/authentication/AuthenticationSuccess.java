package com.afx.web.receiptorganizer.authentication;

import com.afx.web.receiptorganizer.dao.user.UserDao;
import com.afx.web.receiptorganizer.types.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Component
public class AuthenticationSuccess implements AuthenticationSuccessHandler {

    /*
    Logger
     */
    private static Logger logger = LogManager.getLogger(AuthenticationSuccess.class);

    /*
    Private fields
     */

    @Value("${defaultPaginationSize}")
    private String DEFAULT_PAGE_SIZE;

    @Autowired
    private UserDao userDao;
    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    /*
    Override methods
     */

    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
        User user;

        try {
            if (authentication.getName().contains("@")) {
                user = this.userDao.getUser(authentication.getName().substring(0, authentication.getName().indexOf("@")));
            } else {
                user = this.userDao.getUser(authentication.getName());
            }

            if (user.getUserPhotoThumbnail() != null) {
                logger.debug("Retrieved user thumbnail of: " + user.getUserPhotoThumbnail().length + " bytes");
            }
        } catch (EmptyResultDataAccessException e) {
            //First time user, add user to database
            user = new User();
            user.setUsername(authentication.getName());
            user.setPaginationSize(Integer.parseInt(DEFAULT_PAGE_SIZE));
            this.userDao.add(user);
        }

        //Add user info to session
        httpServletRequest.getSession().setAttribute("user", user);

        //Redirect user
        if (httpServletResponse.isCommitted()) {
            logger.error("Response already committed, unable to redirect to home page for: " + user.getUsername());
            return;
        } else {
            handle(httpServletRequest, httpServletResponse);
        }

        clearAuthenticationAttributes(httpServletRequest);

        logger.debug("Login action performed for: " + user.getUsername());
    }

    /*
    Private helpers
     */

    private void handle(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String targetUrl = "/receipts/";

        redirectStrategy.sendRedirect(request, response, targetUrl);
    }

    private void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return;
        }
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }

}
