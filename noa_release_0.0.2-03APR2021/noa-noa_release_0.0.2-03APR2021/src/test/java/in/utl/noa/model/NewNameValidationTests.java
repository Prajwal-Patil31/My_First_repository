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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import org.springframework.web.context.WebApplicationContext;

import in.utl.noa.config.WebMvcJpaAuthAthrTestConfig;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest
@ContextConfiguration(classes = WebMvcJpaAuthAthrTestConfig.class)
@Configuration
@OverrideAutoConfiguration(enabled = false)
@ImportAutoConfiguration(value = { RepositoryRestMvcAutoConfiguration.class })
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class NewNameValidationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserAccountRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private UserDetailsService userDetails;

    @Autowired
    private PasswordPolicyRepository passwordpolicyRepo;

    @Autowired
    private UserGroupRepository userGroupRepo;

    @Autowired
    private ResourceRepository resourceRepository;
    
    @Autowired
    private ResourceGroupRepository resourceGroupRepository;

    @BeforeAll
    public void setup() {
        mockMvc = MockMvcBuilders
        .webAppContextSetup(wac)
        .apply(springSecurity())
        .build();
    }

    @Test
    @DisplayName("Validate Usernames of newly Created User")
    public void validatingUsernameForNewUser() throws Exception {

        UserAccount testUser;

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        testUser = userRepo.findByUserName("newUser");

        if(testUser == null) {
            UserAccount newUser = new UserAccount("newUser", "password");

            mockMvc.perform(post("/api/security-users")
                        .with(user(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(newUser))
                        .accept(MediaType.APPLICATION_JSON));

            UserAccount test = userRepo.findByUserName("newUser");
            assertNotNull(test);
        }
    }

    @Test
    @DisplayName("Validate Role Name of newly Created Role")
    public void validatingRolenameforNewRole() throws Exception {

        Role testRole;

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        testRole = roleRepo.findByRoleName("newRole");

        if(testRole == null) {
            Role newRole = new Role("newRole");

            mockMvc.perform(post("/api/security-roles")
                        .with(user(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(newRole))
                        .accept(MediaType.APPLICATION_JSON));

            Role test = roleRepo.findByRoleName("newRole");
            assertNotNull(test);
        }
    }

    @Test
    @DisplayName("Validate Policy Name of newly Created Passwordpolicy")
    public void validatePasswordpolicyforNewPasswordpolicy () throws Exception {
        
        PasswordPolicy testPasswordpolicy;

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        testPasswordpolicy = passwordpolicyRepo.findByPolicyName("newPasswordpolicy");

        if(testPasswordpolicy == null){
            PasswordPolicy newPasswordpolicy = new PasswordPolicy();
            newPasswordpolicy.setPolicyName("newPasswordPolicy");
            mockMvc.perform(post("/api/security-policies-password")
                        .with(user(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(newPasswordpolicy))
                        .accept(MediaType.APPLICATION_JSON));

            PasswordPolicy test = passwordpolicyRepo.findByPolicyName("newPasswordpolicy");
            assertNotNull(test);
        }
    }

    @Test
    @DisplayName("Validate Group Name of newly Created UserGroup")
    public void validateUserGroupforNewUserGroup() throws Exception {
        
        UserGroup testUsergroup;

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        testUsergroup = userGroupRepo.findByGroupName("newUserGroup");

        if(testUsergroup == null){
            UserGroup newUsergroup = new UserGroup();
            newUsergroup.setGroupName("newUserGroup");
            mockMvc.perform(post("/api/security-groups")
                        .with(user(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(newUsergroup))
                        .accept(MediaType.APPLICATION_JSON));
            
            UserGroup test = userGroupRepo.findByGroupName("newUserGroup");
            assertNotNull(test);
        }
    }

    @Test
    @DisplayName("Validate Resource Name of newly Created Resource")
    public void validatingResourcenameforNewRole() throws Exception {

        Resource testResource = resourceRepository.findByResourceName("newresource");

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        if(testResource == null) {
            Resource newResource = new Resource();
            newResource.setResourceName("newresource");
            mockMvc.perform(post("/api/elements")
                        .with(user(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(newResource))
                        .accept(MediaType.APPLICATION_JSON));

            Resource updResource = resourceRepository.findByResourceName("newresource");
            assertNotNull(updResource);
        }
    }

    @Test
    @DisplayName("Validate Resource Group Name of newly Created Resource Group")
    public void validatingResourceGroupnameforNewRole() throws Exception {

        ResourceGroup testResourceGroup = resourceGroupRepository.findByResourceGroupName("newResourceGroup");

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        if(testResourceGroup == null) {
            ResourceGroup newResourceGrp = new ResourceGroup();
            newResourceGrp.setResourceGroupName("newResourceGroup");
            mockMvc.perform(post("/api/elements-groups")
                        .with(user(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(newResourceGrp))
                        .accept(MediaType.APPLICATION_JSON));

            ResourceGroup updResourceGrp = resourceGroupRepository.findByResourceGroupName("newResourceGroup");
            assertNotNull(updResourceGrp);
        }
    }
}