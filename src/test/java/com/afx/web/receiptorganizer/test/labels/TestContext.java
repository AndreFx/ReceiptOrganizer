package com.afx.web.receiptorganizer.test.labels;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.dao.label.LabelDaoImpl;
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
    public LabelDao labelDao() {
        return Mockito.mock(LabelDaoImpl.class);
    }
}
