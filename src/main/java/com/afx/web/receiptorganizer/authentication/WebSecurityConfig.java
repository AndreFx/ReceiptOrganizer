package com.afx.web.receiptorganizer.authentication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.ldap.authentication.ad.ActiveDirectoryLdapAuthenticationProvider;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    /*
    Private fields
     */

    @Autowired
    AuthenticationSuccess authSuccess;

    @Autowired
    LogoutSuccess logoutSuccess;

    @Value("${ldap.domain}")
    private String DOMAIN;

    @Value("${ldap.url}")
    private String URL;

    @Value("${ldap.searchFilter}")
    private String SEARCH_FILTER;

    @Value("${http.port}")
    private int httpPort;

    @Value("${https.port}")
    private int httpsPort;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        /*
           * Use HTTPs for ALL requests
          */
        http.requiresChannel().anyRequest().requiresSecure();
        http.portMapper().http(httpPort).mapsTo(httpsPort);
        
        http.authorizeRequests().antMatchers("/resources/**", "/login").permitAll()
                .and().authorizeRequests().anyRequest().authenticated()
                .and().formLogin().loginPage("/login").permitAll().successHandler(authSuccess)
                .and().logout().logoutUrl("/logout").logoutSuccessHandler(logoutSuccess).logoutSuccessUrl("/login?logout").invalidateHttpSession(true);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder authManagerBuilder) throws Exception {
        authManagerBuilder.authenticationProvider(activeDirectoryLdapAuthenticationProvider()).userDetailsService(userDetailsService());
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(Arrays.asList(activeDirectoryLdapAuthenticationProvider()));
    }

    @Bean
    public LogoutSuccess logoutSuccessHandlerBean() {
        return new LogoutSuccess();
    }

    @Bean
    public AuthenticationProvider activeDirectoryLdapAuthenticationProvider() {
        LdapTemplate template = new LdapTemplate();
        template.setIgnorePartialResultException(true);
        ActiveDirectoryLdapAuthenticationProvider provider = new ActiveDirectoryLdapAuthenticationProvider(DOMAIN, URL);
        provider.setSearchFilter(SEARCH_FILTER);
        provider.setConvertSubErrorCodesToExceptions(true);
        provider.setUseAuthenticationRequestCredentials(true);
        return provider;
    }
}
