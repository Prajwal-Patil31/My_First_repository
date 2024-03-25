package in.utl.noa.model;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.opendaylight.infrautils.metrics.internal.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.data.rest.RepositoryRestMvcAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.http.HttpMessageConvertersAutoConfiguration;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.boot.test.autoconfigure.OverrideAutoConfiguration;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.MockMvcAutoConfiguration;
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
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;

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

import in.utl.noa.config.WebMvcJpaWAuthNAthrTestConfig;
import in.utl.noa.config.WebSecurityConfig;
import in.utl.noa.controller.UserProfileContoller;
import in.utl.noa.security.authentication.NAuthenticationProvider;
import in.utl.noa.service.FaultService;
import in.utl.noa.service.MDSALService;
import in.utl.noa.service.NUserDetails;

@WebMvcTest
@ContextConfiguration(classes = WebMvcJpaWAuthNAthrTestConfig.class)
@Configuration
@OverrideAutoConfiguration(enabled = false)
@ImportAutoConfiguration(value = { RepositoryRestMvcAutoConfiguration.class })
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class WebMvcTestWithMockMvc {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserDetailsService userDetails;

    @BeforeAll
    public void setup()
    {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();
    }

    @Test
    /* @WithMockUser(username = "admin", password = "pass", roles = "Administrator") */
    void listRestApi() throws Exception {
        UserDetails user = this.userDetails.loadUserByUsername("admin");
    
        /* Controller Test */
        /* mockMvc.perform(get("/api/profile").with(user(user)))
               .andExpect(status().isOk());

        /* mockMvc.perform(get("/api/profile")
               .contentType("application/json"))
               .andExpect(status().isOk()); */
        
        /* Repository Test */
        Role role = new Role("SpringTest");
        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(post("/api/security-roles")
               .with(user(user))
               .contentType(MediaType.APPLICATION_JSON)
               .content(mapper.writeValueAsString(role))
               .accept(MediaType.APPLICATION_JSON))
               .andExpect(status().isCreated());
    }
}
