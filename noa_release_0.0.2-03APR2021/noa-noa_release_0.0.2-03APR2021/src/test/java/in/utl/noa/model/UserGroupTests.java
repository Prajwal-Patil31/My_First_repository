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
public class UserGroupTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserDetailsService userDetails;

    @Autowired
    private UserGroupRepository userGroupRepository;

    @BeforeAll
    public void setup() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();
          
        UserGroup userGroup = new UserGroup();
        userGroup.setGroupName("useraccessgroup");
        userGroupRepository.save(userGroup);
    }

    @Test
    @DisplayName("Creating New UserGroup with Admin Access")
    public void createNewUserGroupWithAdminAccess() throws Exception{

        UserGroup userGroup = new UserGroup();
        userGroup.setGroupName("testgroup");

        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(post("/api/security-groups")
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(userGroup))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Modify UserGroup with Admin Access")
    public void modifyExistingUserGroupWithAdminAccess() throws Exception{

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        UserGroup userGroup = userGroupRepository.findByGroupName("testgroup");
        int groupId = userGroup.getGroupId();
        userGroup.setGroupCode("1234");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(put("/api/security-groups/" + groupId)
            .with(user(user))
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(userGroup))
            .accept(MediaType.APPLICATION_JSON));

        UserGroup updGroup = userGroupRepository.findByGroupName("testgroup");
        assertTrue(updGroup.getGroupCode().equals("1234"));
    }
        
    @Test
    @DisplayName("Delete UserGroup with Admin Access")
    public void deleteExistingUserGroupWithAdminAccess() throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        UserGroup userGroup = userGroupRepository.findByGroupName("testgroup");
        
        ObjectMapper mapper = new ObjectMapper();

        int groupId = userGroup.getGroupId();

        mockMvc.perform(delete("/api/security-groups/" + groupId)
                .with(user(user))
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userGroup))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is(204));
    }

    @Test
    @DisplayName("Creating New User without Admin Access")   
    public void createNewUserGroupWithoutAdminAccess() throws Exception {
        
        UserDetails userDts = this.userDetails.loadUserByUsername("user");
        
        UserGroup userGroup = new UserGroup();
        userGroup.setGroupName("testgroup");
        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(post("/api/security-groups")
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(userGroup))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));
    }

    @Test
    @DisplayName("Modify User without Admin Access")
    public void modifyExistingUserGroupWithoutAdminAccess() throws Exception {

        UserDetails userDts = this.userDetails.loadUserByUsername("user");

        UserGroup userGroup = userGroupRepository.findByGroupName("useraccessgroup");
        int groupId = userGroup.getGroupId();
        userGroup.setGroupCode("1234");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(put("/api/security-groups/" + groupId)
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(userGroup))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));
    }

    @Test
    @DisplayName("Delete Existing User without Admin Access")
    public void deleteExistingUserGroupWithoutAdminAccess() throws Exception {

        UserDetails userDts = this.userDetails.loadUserByUsername("user");

        UserGroup userGroup = userGroupRepository.findByGroupName("useraccessgroup");
        
        ObjectMapper mapper = new ObjectMapper();

        int groupId = userGroup.getGroupId();

        mockMvc.perform(put("/api/security-groups/" + groupId)
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(userGroup))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));
    }

    @AfterAll
    public void tearDown() throws Exception {
        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        UserGroup userGroup = userGroupRepository.findByGroupName("useraccessgroup");
        ObjectMapper mapper = new ObjectMapper();
        int groupId = userGroup.getGroupId();

        mockMvc.perform(delete("/api/security-groups/" + groupId)
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(userGroup))
                    .accept(MediaType.APPLICATION_JSON));
    }
}