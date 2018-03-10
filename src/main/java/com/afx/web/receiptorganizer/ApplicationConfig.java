package com.afx.web.receiptorganizer;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jndi.JndiTemplate;
import org.springframework.security.access.SecurityConfig;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import javax.naming.NamingException;
import javax.sql.DataSource;

@Configuration
@PropertySource(value = {"classpath:application.properties"})
@EnableWebMvc
public class ApplicationConfig extends WebMvcConfigurerAdapter {

    private static Logger logger = LogManager.getLogger(ApplicationConfig.class);

    @Value("${jndiDatasource}")
    private String DATASOURCE;

    static {
        logger.info("SETTING ICEPDF PROPERTIES...");
        System.getProperties().put("org.icepdf.core.scaleImages", "false");
        System.getProperties().put("org.icepdf.core.imageReference", "smoothScaled");
        System.getProperties().put("org.icepdf.core.nfont.truetype.hinting", "true");
        System.getProperties().put("org.icepdf.core.nfont.truetype.hinting.alwayson", "true");
        System.getProperties().put("org.icepdf.core.awtFontLoading", "true");
        System.getProperties().put("org.icepdf.core.ccittfax.jai", "true");
        logger.info("FINISHED SETTING ICEPDF PROPERTIES...");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
	    registry.addViewController("/").setViewName("forward:/receipts/");
	    registry.addViewController("login").setViewName("login");
    }

    @Bean
    DataSource dataSource() {
        DataSource dataSource = null;
        JndiTemplate jndi = new JndiTemplate();
        try {
            dataSource = jndi.lookup("java:/" + DATASOURCE, DataSource.class);
        } catch (NamingException e) {
            logger.error("NamingException for java:/" + DATASOURCE, e);
        }
        return dataSource;
    }

    @Bean
    public NamedParameterJdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new NamedParameterJdbcTemplate(dataSource);
    }
}
