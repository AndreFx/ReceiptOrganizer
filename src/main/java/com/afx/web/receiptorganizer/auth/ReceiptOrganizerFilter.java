package com.afx.web.receiptorganizer.auth;

import com.afx.web.receiptorganizer.login.LoginController;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet Filter implementation class ReceiptOrganizerFilter
 */
@WebFilter("/ReceiptOrganizer")
public class ReceiptOrganizerFilter implements Filter {

    private static Logger logger = LogManager.getLogger(LoginController.class);

    private FilterConfig fc;

    /**
     * Default constructor.
     */
    public ReceiptOrganizerFilter() {
    }

    /**
     * @see Filter#destroy()
     */
    @Override
    public void destroy() {
    }

    /**
     * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpReq = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // pass the request along the filter chain
        if (httpReq.getSession().getAttribute("user") != null) {
            chain.doFilter(request, response);
        } else if(httpReq.getRequestURI().equals(this.fc.getInitParameter("login-page"))
                || httpReq.getRequestURI().equals(this.fc.getInitParameter("login-action"))
                || httpReq.getRequestURI().contains(this.fc.getInitParameter("resources"))) {
            chain.doFilter(request, response);
        } else {
            logger.warn("User not logged in attempting to reach restricted page; redirecting.");
            httpResponse.sendRedirect("/ReceiptOrganizer/");
        }
    }

    /**
     * @see Filter#init(FilterConfig)
     */
    @Override
    public void init(FilterConfig fConfig) throws ServletException {
        this.fc = fConfig;
    }

}
