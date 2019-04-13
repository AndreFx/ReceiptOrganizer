package com.afx.web.receiptorganizer.test.webappcontext;

import com.afx.web.receiptorganizer.service.label.LabelService;
import com.afx.web.receiptorganizer.service.label.LabelServiceV1;
import com.afx.web.receiptorganizer.service.receipt.ReceiptService;
import com.afx.web.receiptorganizer.service.receipt.ReceiptServiceV1;
import com.afx.web.receiptorganizer.service.user.UserService;
import com.afx.web.receiptorganizer.service.user.UserServiceV1;

import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

@Profile("test")
@Configuration
public class TestContext {

    @Bean
    @Primary
    public LabelService labelService() {
        return Mockito.mock(LabelServiceV1.class);
    }

    @Bean
    @Primary
    public UserService userService() {
        return Mockito.mock(UserServiceV1.class);
    }

    @Bean
    @Primary
    public ReceiptService receiptService() {
        return Mockito.mock(ReceiptServiceV1.class);
    }
}
