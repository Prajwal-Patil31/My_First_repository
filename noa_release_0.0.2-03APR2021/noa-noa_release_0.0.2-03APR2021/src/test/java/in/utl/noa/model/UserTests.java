package in.utl.noa.model;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.opendaylight.infrautils.metrics.internal.Configuration;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.data.rest.RepositoryRestMvcAutoConfiguration;
import org.springframework.boot.test.autoconfigure.OverrideAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.test.context.ContextConfiguration;

import org.springframework.test.web.servlet.MockMvc;

import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import org.springframework.web.context.WebApplicationContext;

import in.utl.noa.config.WebMvcJpaAuthAthrTestConfig;

import org.springframework.http.MediaType;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest
@ContextConfiguration(classes = WebMvcJpaAuthAthrTestConfig.class)
@Configuration
@OverrideAutoConfiguration(enabled = false)
@ImportAutoConfiguration(value = {RepositoryRestMvcAutoConfiguration.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserTests {

    @Autowired
    private MockMvc mockMvc ;

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

        UserAccount modifyUser = new UserAccount("forModify", "password");
        userRepository.save(modifyUser);
    }

    @Test
    @DisplayName("Creating New User with Admin Access")
    public void createNewUserWithAdminAccess() throws Exception {

        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        UserAccount user = new UserAccount("testing", "password");
        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(post("/api/security-users")
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(user))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isCreated());

    }
    
    @Test
    @DisplayName("Modify Existing User with Admin Access")
    public void modifyExistingUserWithAdminAccess() throws Exception {

        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        UserAccount user;
        user = userRepository.findByUserName("forModify");
        int accountId = user.getAccountId();
        user.setMobileNo("1234");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(put("/api/security-users/" + accountId)
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(user))
                    .accept(MediaType.APPLICATION_JSON));
        
        UserAccount updUser = userRepository.findByUserName("forModify");
        assertTrue(updUser.getMobileNo().equals("1234"));
    }
        
    @Test
    @DisplayName("Delete User with Admin Access")
    public void deleteExistingUserWithAdminAccess() throws Exception {
        
        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        UserAccount user = userRepository.findByUserName("forModify");
        int accountId = user.getAccountId();
        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(delete("/api/security-users/" + accountId)
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(user))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(204));

    }   

    @Test
    @DisplayName("Creating New User without Admin Access")
    public void createNewUserWithoutAdminAccess() throws Exception {
        
        UserDetails userDts = this.userDetails.loadUserByUsername("user");
        
        UserAccount user = new UserAccount("rolebyuser", "password");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(post("/api/security-users")
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(user))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));
    }

    @Test
    @DisplayName("Modify User without Admin Access")
    public void modifyExistingUserWithoutAdminAccess() throws Exception {

        UserDetails userDts = this.userDetails.loadUserByUsername("user");

        UserAccount user = userRepository.findByUserName("testing");

        int accountId = user.getAccountId();
        user.setMobileNo("1234");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(put("/api/security-users/" + accountId)
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(user))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));
    }

    @Test
    @DisplayName("Delete Existing User without Admin Access")
    public void deleteExistingUserWithoutAdminAccess() throws Exception {

        UserDetails userDts = this.userDetails.loadUserByUsername("user");

        UserAccount user = userRepository.findByUserName("testing");
        int accountId = user.getAccountId();
        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(delete("/api/security-users/" + accountId)
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(user))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));
    }

    @AfterAll
    public void tearDown() throws Exception {
        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        UserAccount modifyUser = userRepository.findByUserName("testing");
        int newAccountId = modifyUser.getAccountId();

        mockMvc.perform(delete("/api/security-users/" + newAccountId)
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(modifyUser))
                    .accept(MediaType.APPLICATION_JSON));
    }

}      