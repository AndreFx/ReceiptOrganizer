package com.afx.web.receiptorganizer.config;

import com.afx.web.receiptorganizer.authentication.SessionListener;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.DispatcherType;
import javax.servlet.ServletContext;
import javax.servlet.ServletRegistration;

public class ApplicationInitializer implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext servletContext) {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(ApplicationConfig.class);

        context.setDisplayName("ReceiptOrganizer");

        servletContext.addListener(new ContextLoaderListener(context));
        servletContext.addListener(new SessionListener());
        servletContext.addFilter("springSecurityFilterChain", DelegatingFilterProxy.class)
                .addMappingForUrlPatterns(null, false, "/*");

        DispatcherServlet dispatcherServlet = new DispatcherServlet(context);
        dispatcherServlet.setThrowExceptionIfNoHandlerFound(true);

        ServletRegistration.Dynamic dispatcher = servletContext
                .addServlet("spring-mvc-dispatcher", dispatcherServlet);

        dispatcher.setLoadOnStartup(1);
        dispatcher.addMapping("/");
    }
}
