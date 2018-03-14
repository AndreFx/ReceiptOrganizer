package com.afx.web.receiptorganizer.authentication;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

@Component
public class SessionListener implements HttpSessionListener {

    /*
    Logger
     */
    private static Logger logger = LogManager.getLogger(SessionListener.class);

    /*
    HttpSessionListener implementation
     */

    @Override
    public void sessionCreated(HttpSessionEvent event) {
        logger.info("session created");
        event.getSession().setMaxInactiveInterval(1800);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        logger.info("session destroyed");
    }

}
