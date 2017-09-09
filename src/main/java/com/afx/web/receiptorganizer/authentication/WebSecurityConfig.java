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

    @Autowired
    AuthenticationSuccess success;

    @Value("${ldap.domain}")
    private String DOMAIN;

    @Value("${ldap.url}")
    private String URL;

    //@Value("${http.port}")
    //private int httpPort;

    //@Value("${https.port}")
    //private int httpsPort;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
          /*
           * Set up your spring security config here. For example...
          */
        http.authorizeRequests().antMatchers("/resources/**", "/login").permitAll().and().authorizeRequests().anyRequest().authenticated()
                .and().formLogin().loginPage("/login").permitAll().successHandler(success)
                .and().logout().logoutUrl("/logout").logoutSuccessUrl("/login?logout").invalidateHttpSession(true);
          /*
           * Use HTTPs for ALL requests
          */
        //TODO Add https
        //http.requiresChannel().anyRequest().requiresSecure();
        //http.portMapper().http(httpPort).mapsTo(httpsPort);
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
    public AuthenticationProvider activeDirectoryLdapAuthenticationProvider() {
        LdapTemplate template = new LdapTemplate();
        template.setIgnorePartialResultException(true);
        ActiveDirectoryLdapAuthenticationProvider provider = new ActiveDirectoryLdapAuthenticationProvider(DOMAIN, URL);
        provider.setConvertSubErrorCodesToExceptions(true);
        provider.setUseAuthenticationRequestCredentials(true);
        return provider;
    }
}
