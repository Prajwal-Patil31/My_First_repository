package in.utl.noa.model;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.opendaylight.infrautils.metrics.internal.Configuration;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.data.rest.RepositoryRestMvcAutoConfiguration;

import org.springframework.boot.test.autoconfigure.OverrideAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import in.utl.noa.config.WebMvcJpaAuthAthrTestConfig;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@WebMvcTest
@ContextConfiguration(classes = WebMvcJpaAuthAthrTestConfig.class)
@Configuration
@OverrideAutoConfiguration(enabled = false)
@ImportAutoConfiguration(value = { RepositoryRestMvcAutoConfiguration.class })
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserAssignmentTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserDetailsService userDetails;

    @BeforeAll
    public void setup() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();
    }

    @Test
    @DisplayName("Assigning a Role with Admin Access")
    public void assigningRoleToUserWithAdminAccess() throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("admin");
        ObjectMapper mapper = new ObjectMapper();

        Role role = new Role("TestRole");
        UserAccount testUser = new UserAccount("newUser", "password");
        testUser.setRole(role);

        mockMvc.perform(put("/api/security-users")
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(testUser))
                    .accept(MediaType.APPLICATION_JSON));

        Role userRole = testUser.getRole();
        assertNotNull(userRole);
    }

    @Test
    @DisplayName("Assigning a Role with User Access")
    public void assigningRoleToUserWithUserAccess() throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("user");
        ObjectMapper mapper = new ObjectMapper();

        Role role = new Role("TestRole");
        UserAccount testUser = new UserAccount("testUser", "password");
        testUser.setRole(role);

        mockMvc.perform(put("/api/security-users")
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(testUser))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));
    }

    @Test
    @DisplayName("Assigning a Policy with User Access")
    public void assignPolicyToUserWithAdminAccess () throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        PasswordPolicy policy = new PasswordPolicy();
        policy.setPolicyName("TestPolicy");
        UserAccount testUser = new UserAccount("newUser","password");
        testUser.setPolicyId(policy);

        mockMvc.perform(put("/api/security-policies-password")
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(testUser))
                    .accept(MediaType.APPLICATION_JSON));

        PasswordPolicy userpolicy = testUser.getPolicyId();
        assertNotNull(userpolicy);
    }

    @Test
    @DisplayName("Assigning a Policy with UserAccess")
    public void assigningPolicyToUserWithUserAccess () throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("user");

        ObjectMapper mapper = new ObjectMapper();

        PasswordPolicy policy = new PasswordPolicy();
        policy.setPolicyName("TestPolicy");
        UserAccount testUser = new UserAccount("testUser","password");
        testUser.setPolicyId(policy);

        mockMvc.perform(put("/api/security-policies-password")
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(testUser))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));
    }
}