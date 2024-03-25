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

import org.springframework.test.web.servlet.MockMvc;

import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.context.ContextConfiguration;

import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import com.fasterxml.jackson.databind.ObjectMapper;

import in.utl.noa.config.WebMvcJpaAuthAthrTestConfig;

import org.springframework.http.MediaType;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

@WebMvcTest
@ContextConfiguration(classes = WebMvcJpaAuthAthrTestConfig.class)
@Configuration
@OverrideAutoConfiguration(enabled = false)
@ImportAutoConfiguration(value = { RepositoryRestMvcAutoConfiguration.class })
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class RestOperationsTests {  
 
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserDetailsService userDetails;

    @Autowired
    private UserAccountRepository userRepository;

    @BeforeAll
    public void setup() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();

        UserAccount user = new UserAccount();
        user.setUsername("useraccess");
        user.setAcStatus(true);
        user.setPassword("password");
        userRepository.save(user);
    }

    @Test
    @DisplayName("Modify Existing User and Verify in DB")
    public void modifyExistingUserAndCheckInDb() throws Exception{

        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        UserAccount user = userRepository.findByUserName("useraccess");
        int accountId = user.getAccountId();
        user.setMobileNo("1234");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(put("/api/security-users/" + accountId)
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(user))
                    .accept(MediaType.APPLICATION_JSON));
        
        UserAccount updUser = userRepository.findByUserName("useraccess");
        assertTrue(updUser.getMobileNo().equals("1234"));
    }
    
    @Test
    @DisplayName("Delete Existing User and Verify in DB")
    public void deletingExistingUserAndCheckInDb() throws Exception {
        
        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        UserAccount user = userRepository.findByUserName("useraccess");
        int accountId = user.getAccountId();
        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(delete("/api/security-users/" + accountId)
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(user))
                    .accept(MediaType.APPLICATION_JSON));

        UserAccount updUser = userRepository.findByUserName("useraccess");
        assertNull(updUser);
    }
}