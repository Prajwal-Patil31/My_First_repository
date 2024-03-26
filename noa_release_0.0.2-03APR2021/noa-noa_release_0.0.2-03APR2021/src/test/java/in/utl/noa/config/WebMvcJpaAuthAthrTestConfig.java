package in.utl.noa.config;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.client.MockMvcWebTestClient;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import javax.persistence.EntityManagerFactory;
import javax.servlet.http.HttpServletResponse;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.http.MediaType;
import org.springframework.integration.annotation.IntegrationComponentScan;

import com.fasterxml.jackson.databind.ObjectMapper;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import in.utl.noa.config.WebSecurityConfig;
import in.utl.noa.controller.UserProfileContoller;
import in.utl.noa.model.UserAccount;
import in.utl.noa.security.authentication.NAuthenticationProvider;
import in.utl.noa.security.authorization.WebSecurityService;
import in.utl.noa.service.FaultService;
import in.utl.noa.service.MDSALService;
import in.utl.noa.service.NUserDetails;

@TestConfiguration
@EnableWebSecurity
@EnableWebMvc
/* @EntityScan
@EnableJpaAuditing
@EnableJpaRepositories
@EnableTransactionManagement
@IntegrationComponentScan
@EnableCaching 
@EnableAutoConfiguration */
@AutoConfigureDataJpa
@Order(Ordered.HIGHEST_PRECEDENCE)
public class WebMvcJpaAuthAthrTestConfig extends WebSecurityConfigurerAdapter {

    @MockBean
    private FaultService faultService;

    @MockBean
    private MDSALService mdsalService;
    
    private NUserDetails userDetails;

    private WebSecurityService webSecurity;

    public WebMvcJpaAuthAthrTestConfig() {
        super();
        userDetails = new NUserDetails();
        webSecurity = new WebSecurityService();
    }
    
    @Bean
    public NUserDetails userDetails() {
        return userDetails;
    }

    @Bean
    public WebSecurityService webSecurity() {
        return webSecurity;
    }
    
    @Override
    public void configure(final WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/resources/**");
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
            //.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeRequests()
                .antMatchers("/", "/index", "/error", "/built/**", "/*.css", "/images/**", "/lib/**").permitAll()
                .antMatchers("/logout").permitAll()
                .antMatchers("/api/profile").authenticated()
                .antMatchers("/api/**").access("@webSecurity.check(authentication, request)")
                .anyRequest().authenticated()
                .and()
            .httpBasic()
                .and()
            .logout(logout -> logout
                .permitAll()
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(HttpServletResponse.SC_OK);
                }))
            .csrf().disable();
    }
}