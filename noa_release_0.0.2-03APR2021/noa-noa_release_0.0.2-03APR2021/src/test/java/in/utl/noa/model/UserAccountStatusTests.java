package in.utl.noa.model;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.opendaylight.infrautils.metrics.internal.Configuration;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.data.rest.RepositoryRestMvcAutoConfiguration;

import org.springframework.boot.test.autoconfigure.OverrideAutoConfiguration;

import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ContextConfiguration;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import org.springframework.web.context.WebApplicationContext;

import org.springframework.http.MediaType;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import com.fasterxml.jackson.databind.ObjectMapper;

import in.utl.noa.config.WebMvcJpaAuthAthrTestConfig;

@WebMvcTest
@ContextConfiguration(classes = WebMvcJpaAuthAthrTestConfig.class)
@Configuration
@OverrideAutoConfiguration(enabled = false)
@ImportAutoConfiguration(value = { RepositoryRestMvcAutoConfiguration.class })
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserAccountStatusTests {
     
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserDetailsService userDetails;

    @Autowired
    private UserAccountRepository userRepository;

    @Autowired
    private RoleRepository  roleRepository;

    @BeforeAll
    public void setup() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();

        UserAccount user = new UserAccount();
        user.setUsername("useraccesstest");
        user.setAcStatus(true);
        user.setPassword("password");
        userRepository.save(user);
        
        Role role=roleRepository.findByRoleName("Administrator");
        user.setRole(role);
        userRepository.save(user);
    }

    @Test
    @DisplayName("Test User when Status is Active")
    public void activeUserStatus() throws Exception {       
        
        UserDetails userDts = this.userDetails.loadUserByUsername("useraccesstest");

        mockMvc.perform( MockMvcRequestBuilders
                .get("/login")
                .with(user(userDts))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().is(200));
    }      
        
    @Test
    @DisplayName("Test User when Status is InActive")
    public void inactiveUserStatus() throws Exception {   
        
        UserAccount user = userRepository.findByUserName("useraccesstest");
        user.setAcStatus(false);
        
        UserDetails userDts = this.userDetails.loadUserByUsername("useraccesstest");
        
        mockMvc.perform( MockMvcRequestBuilders
                    .get("/login")
                    .with(user(userDts))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().is(200));
    }

    @AfterAll
    public void tearDown() throws Exception {
        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        UserAccount user = userRepository.findByUserName("useraccesstest");
        int accountId = user.getAccountId();
        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(delete("/api/security-users/" + accountId)
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(user))
                    .accept(MediaType.APPLICATION_JSON));
    }
}

