package com.afx.web.receiptorganizer.authentication;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import org.springframework.security.web.csrf.MissingCsrfTokenException;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;

/**
 * When the session expires and a request requiring CSRF is received (POST), the
 * missing token exception is handled by caching the current request and
 * redirecting the user to the login page after which their original request
 * will complete. The intended result is that no loss of data due to the timeout
 * will occur.
 * Credit to https://stackoverflow.com/questions/27654206/session-timeout-leads-to-access-denied-in-spring-mvc-when-csrf-integration-with
 */
public class MissingCsrfTokenAccessDeniedHandler extends AccessDeniedHandlerImpl {
    private RequestCache requestCache = new HttpSessionRequestCache();
    private String loginPage = "/";

    @Override
    public void handle(HttpServletRequest req, HttpServletResponse res, AccessDeniedException exception)
            throws IOException, ServletException {
        if (exception instanceof MissingCsrfTokenException && isSessionInvalid(req)) {
            requestCache.saveRequest(req, res);
            res.sendRedirect(req.getContextPath() + loginPage);
        }
        super.handle(req, res, exception);
    }

    private boolean isSessionInvalid(HttpServletRequest req) {
        try {
            HttpSession session = req.getSession(false);
            return session == null || !req.isRequestedSessionIdValid();
        } catch (IllegalStateException ex) {
            return true;
        }
    }

    public void setRequestCache(RequestCache requestCache) {
        this.requestCache = requestCache;
    }

    public void setLoginPage(String loginPage) {
        this.loginPage = loginPage;
    }
}