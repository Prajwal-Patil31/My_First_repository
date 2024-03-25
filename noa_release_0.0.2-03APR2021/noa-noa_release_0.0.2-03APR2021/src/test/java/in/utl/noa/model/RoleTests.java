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
@ImportAutoConfiguration(value = { RepositoryRestMvcAutoConfiguration.class })
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class RoleTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserDetailsService userDetails;

    @Autowired
    private RoleRepository roleRepository;

    @BeforeAll
    public void setup() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();

        Role role = new Role("useraccess");
        roleRepository.save(role);
    }

    @Test
    @DisplayName("Creating New Role with Admin Access")
    public void createNewRoleWithAdminAccess() throws Exception {

        Role role = new Role("testing");

        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(post("/api/security-roles")
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(role))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Modify Role with Admin Access")
    public void modifyExistingRolewithAdminAccess() throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        Role role;
        role = roleRepository.findByRoleName("testing");
        int roleId = role.getRoleId();
        role.setRoleCode("two");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(put("/api/security-roles/" + roleId)
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(role))
                    .accept(MediaType.APPLICATION_JSON));

        Role updRole = roleRepository.findByRoleName("testing");            
        assertTrue(updRole.getRoleCode().equals("two"));
    }

    @Test
    @DisplayName("Delete Existing Role with Admin Access")
    public void deleteExistingRoleWithAdminAccess() throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        Role role;

        ObjectMapper mapper = new ObjectMapper();
        role = roleRepository.findByRoleName("testing");
            
        int roleId = role.getRoleId();

        mockMvc.perform(delete("/api/security-roles/" + roleId)
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(role))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(204));
    }

    @Test
    @DisplayName("Creating New Role without Admin Access")
    public void createNewRoleWithoutAdminAccess() throws Exception {
        
        UserDetails userDts = this.userDetails.loadUserByUsername("user");
        
        Role role = new Role("rolebyuser");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(post("/api/security-roles")
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(role))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));

    }

    @Test
    @DisplayName("Modify Role without Admin Access")
    public void modifyExistingRoleWithoutAdminAccess() throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("user");

        Role role;
        role = roleRepository.findByRoleName("useraccess");
        int roleId = role.getRoleId();
        role.setRoleCode("two");

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(put("/api/security-roles/" + roleId)
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(role))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));
    }

    @Test
    @DisplayName("Delete Existing Role without Admin Access")
    public void deleteExistingRoleWithoutAdminAccess() throws Exception {

        UserDetails user = this.userDetails.loadUserByUsername("user");

        Role role = roleRepository.findByRoleName("useraccess");

        ObjectMapper mapper = new ObjectMapper();

        int roleId = role.getRoleId();

        mockMvc.perform(delete("/api/security-roles/" + roleId)
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(role))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));
    }

    @AfterAll
    public void tearDown() throws Exception {
        UserDetails user = this.userDetails.loadUserByUsername("admin");

        Role role = roleRepository.findByRoleName("useraccess");

        ObjectMapper mapper = new ObjectMapper();

        int roleId = role.getRoleId();

        mockMvc.perform(delete("/api/security-roles/" + roleId)
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(role))
                    .accept(MediaType.APPLICATION_JSON));
    }
}