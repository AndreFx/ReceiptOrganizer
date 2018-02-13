package com.afx.web.receiptorganizer.authentication;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class LogoutSuccess extends SimpleUrlLogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

//        if (authentication.getName().contains("@")) {
//            ReceiptController.removeUserFromCache(authentication.getName().substring(0, authentication.getName().indexOf("@")));
//        } else {
//            ReceiptController.removeUserFromCache(authentication.getName());
//        }

        super.onLogoutSuccess(request, response, authentication);
    }
}
