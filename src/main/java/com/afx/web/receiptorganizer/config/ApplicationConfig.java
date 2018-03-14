package com.afx.web.receiptorganizer.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jndi.JndiTemplate;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import javax.naming.NamingException;
import javax.sql.DataSource;
import java.util.Locale;

@Configuration
@ComponentScan(basePackages = {"com.afx.web.receiptorganizer"})
@PropertySource(value = {"classpath:application.properties"})
@EnableTransactionManagement
@EnableWebMvc
public class ApplicationConfig implements WebMvcConfigurer {

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
    public ViewResolver configureViewResolver() {
        InternalResourceViewResolver viewResolver= new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/jsp/");
        viewResolver.setSuffix(".jsp");

        return viewResolver;
    }

    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("/resources/theme1/")
                .setCachePeriod(31556926);
    }

    @Bean
    public DataSource dataSource() {
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

    @Bean
    public DataSourceTransactionManager transactionManager() {
        return new DataSourceTransactionManager(dataSource());
    }

    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver resolver = new CommonsMultipartResolver();
        resolver.setMaxUploadSize(10000000);
        return resolver;
    }

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    @Bean
    public ResourceBundleMessageSource messageSource() {
        ResourceBundleMessageSource source = new ResourceBundleMessageSource();
        source.setBasename("i18n/messages");
        source.setDefaultEncoding("UTF-8");
        source.setUseCodeAsDefaultMessage(true);
        return source;
    }

    @Bean
    public LocaleResolver localeResolver(){
        CookieLocaleResolver resolver = new CookieLocaleResolver();
        resolver.setDefaultLocale(new Locale("en"));
        resolver.setCookieName("myLocaleCookie");
        resolver.setCookieMaxAge(4800);
        return resolver;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
        interceptor.setParamName("mylocale");
        registry.addInterceptor(interceptor);
    }
}
