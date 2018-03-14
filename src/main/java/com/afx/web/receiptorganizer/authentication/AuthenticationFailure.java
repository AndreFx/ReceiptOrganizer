package com.afx.web.receiptorganizer.authentication;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AuthenticationFailure extends SimpleUrlAuthenticationFailureHandler {

    /*
    Private fields
     */
    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        logger.error("Failed to authenticate user.");

        //Redirect user
        if (response.isCommitted()) {
            logger.error("Response already committed, unable to redirect user back to login after authentication failure.");
        } else {
            handle(request, response);
        }
    }

    /*
    Private helpers
     */

    private void handle(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String targetUrl = "/login/";

        redirectStrategy.sendRedirect(request, response, targetUrl);
    }

}
