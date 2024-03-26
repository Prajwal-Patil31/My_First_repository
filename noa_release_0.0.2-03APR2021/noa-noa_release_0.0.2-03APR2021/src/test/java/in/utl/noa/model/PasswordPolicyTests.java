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

import org.springframework.test.context.ContextConfiguration;

import org.springframework.test.web.servlet.MockMvc;

import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
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
public class PasswordPolicyTests {
    
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserDetailsService userDetails;
    
    @Autowired
    private PasswordPolicyRepository passwordPolicyRepository;

    @BeforeAll
    public void setup() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();

        PasswordPolicy passwordPolicy = new PasswordPolicy();
        passwordPolicy.setPolicyName("newpolicy");;
        passwordPolicyRepository.save(passwordPolicy);
    }

    @Test
    @DisplayName("Creating New Password Policy With Admin Access")
    public void createNewPolicyWithAdminAccess() throws Exception {

        PasswordPolicy policy = new PasswordPolicy();
        policy.setPolicyName("testingpolicy");

        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(post("/api/security-policies-password")
                        .with(user(userDts))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(policy))
                        .accept(MediaType.APPLICATION_JSON))
                        .andExpect(status().isCreated());
    }
    
    @Test
    @DisplayName("Modify Password Policy with Admin Access")  
    public void modifyExsitingPolicyWithAdminAccess() throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        PasswordPolicy newPolicy = passwordPolicyRepository.findByPolicyName("newpolicy");
        int policyId = newPolicy.getPolicyId();
        newPolicy.setminLength(4);
        
        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(put("/api/security-policies-password/" + policyId)
            .with(user(user))
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(newPolicy))
            .accept(MediaType.APPLICATION_JSON));

        PasswordPolicy updpolicy = passwordPolicyRepository.findByPolicyName("newpolicy");
        assertEquals(4,updpolicy.getminLength());
    }
    
    @Test
    @DisplayName("Delete Existing Password Policy with Admin Access")  
    public void deleteExistingPolicyWithAdminAccess() throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        PasswordPolicy passwordpolicy;
        passwordpolicy = passwordPolicyRepository.findByPolicyName("newpolicy");
        int policyId = passwordpolicy.getPolicyId();
        
        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(delete("/api/security-policies-password/" + policyId)
            .with(user(user))
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(passwordpolicy))
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().is(204));

    }

    @Test
    @DisplayName("Creating New Password Policy Without Admin Access")
    public void createNewPolicyWithoutAdminAccess() throws Exception {

        PasswordPolicy policy = new PasswordPolicy();
        policy.setPolicyName("testingpolicy");

        UserDetails userDts = this.userDetails.loadUserByUsername("user");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(post("/api/security-policies-password")
                        .with(user(userDts))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(policy))
                        .accept(MediaType.APPLICATION_JSON))
                        .andExpect(status().is(403));
    }

    @Test
    @DisplayName("Modify Password Policy Without Admin Access")  
    public void modifyExsitingPolicyWithoutAdminAccess() throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("user");

        PasswordPolicy newPolicy = passwordPolicyRepository.findByPolicyName("testingpolicy");
        int policyId = newPolicy.getPolicyId();
        newPolicy.setminLength(4);
        
        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(put("/api/security-policies-password/" + policyId)
            .with(user(user))
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(newPolicy))
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().is(403));  
    }

    @Test
    @DisplayName("Delete Existing Password Policy without Admin Access")  
    public void deleteExistingPolicyWithoutAdminAccess() throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("user");

        PasswordPolicy passwordpolicy;
        passwordpolicy = passwordPolicyRepository.findByPolicyName("testingpolicy");
        int policyId = passwordpolicy.getPolicyId();
        
        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(delete("/api/security-policies-password/" + policyId)
            .with(user(user))
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(passwordpolicy))
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().is(403));  

    }

    @AfterAll
    public void tearDown() throws Exception {
        UserDetails user = this.userDetails.loadUserByUsername("admin");
        ObjectMapper mapper = new ObjectMapper();

        PasswordPolicy policy = passwordPolicyRepository.findByPolicyName("testingpolicy");
        int newpolicyId = policy.getPolicyId();       
        
        mockMvc.perform(delete("/api/security-policies-password/" + newpolicyId)
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(policy))
                    .accept(MediaType.APPLICATION_JSON));
    }
}
        