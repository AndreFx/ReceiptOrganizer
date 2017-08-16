package com.afx.web.receiptorganizer;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jndi.JndiTemplate;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import javax.naming.NamingException;
import javax.sql.DataSource;

@Configuration
@EnableWebMvc
public class ApplicationConfig extends WebMvcConfigurerAdapter {

    private static Logger logger = LogManager.getLogger(ApplicationConfig.class);

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
	    registry.addViewController("/").setViewName("forward:/login");
    }

    @Bean
    DataSource dataSource() {
        DataSource dataSource = null;
        JndiTemplate jndi = new JndiTemplate();
        try {
            dataSource = jndi.lookup("java:/MSSQLDS", DataSource.class);
        } catch (NamingException e) {
            logger.error("NamingException for java:/MSSQLDS", e);
        }
        return dataSource;
    }

    @Bean
    public NamedParameterJdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new NamedParameterJdbcTemplate(dataSource);
    }
}
