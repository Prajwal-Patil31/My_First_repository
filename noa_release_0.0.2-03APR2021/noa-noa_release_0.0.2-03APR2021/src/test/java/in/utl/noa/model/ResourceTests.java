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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import org.springframework.web.context.WebApplicationContext;

import org.springframework.http.MediaType;

import com.fasterxml.jackson.databind.ObjectMapper;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import in.utl.noa.config.WebMvcJpaAuthAthrTestConfig;

@WebMvcTest
@ContextConfiguration(classes = WebMvcJpaAuthAthrTestConfig.class)
@Configuration
@OverrideAutoConfiguration(enabled = false)
@ImportAutoConfiguration(value = { RepositoryRestMvcAutoConfiguration.class })
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ResourceTests {
     
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserDetailsService userDetails;
   
    @Autowired
    private ResourceRepository resourceRepository;  

    @BeforeAll
    public void setup() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();

        Resource resource = new Resource();
        resource.setResourceName("useraccess");
        resourceRepository.save(resource);

    }

    @Test
    @DisplayName("Creating Resources with Admin Access")
    public void createNewResourceWithAdminAccess() throws Exception {
        
        UserDetails user = this.userDetails.loadUserByUsername("admin");
        
        Resource resource = new Resource();
        resource.setResourceName("newswitch");
        ObjectMapper mapper = new ObjectMapper();   

        mockMvc.perform(post("/api/elements")
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(resource))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Modify Existing Resource with Admin Access")
    public void modifyExistingResourceWithAdminAccess() throws Exception {
        
        UserDetails user = this.userDetails.loadUserByUsername("admin");
        ObjectMapper mapper = new ObjectMapper();

        Resource resource = resourceRepository.findByResourceName("useraccess");             
        resource.setResourceCode("1234");      
        int resourceId=resource.getResourceId();        
     
        mockMvc.perform(put("/api/elements/" + resourceId)
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(resource))
                    .accept(MediaType.APPLICATION_JSON));  
                    
        Resource newResource = resourceRepository.findByResourceName("useraccess");
        assertTrue(newResource.getResourceCode().equals("1234"));
    }

    @Test
    @DisplayName("Delete Existing Resource with Admin Access")
    public void deleteExistingResourceWithAdminAccess() throws Exception {
        
        UserDetails user = this.userDetails.loadUserByUsername("admin");
        ObjectMapper mapper = new ObjectMapper();

        Resource resource = resourceRepository.findByResourceName("useraccess");             
        int resourceId=resource.getResourceId();        
     
        mockMvc.perform(delete("/api/elements/" + resourceId)
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(resource))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(204));                
    }

    @Test
    @DisplayName("Creating Resources without Admin Access")
    public void createNewResourceWithoutAdminAccess() throws Exception {
        
        UserDetails user = this.userDetails.loadUserByUsername("user");
        Resource resource = new Resource();
        resource.setResourceName("SwitchM1");
        ObjectMapper mapper = new ObjectMapper();   

        mockMvc.perform(post("/api/elements")
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(resource))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));  
    }

    @Test
    @DisplayName("Modify Existing Resource without Admin Access")
    public void modifyExistingResourceWithoutAdminAccess() throws Exception {
        
        UserDetails user = this.userDetails.loadUserByUsername("user");
        ObjectMapper mapper = new ObjectMapper();

        Resource resource = resourceRepository.findByResourceName("useraccess");             
        resource.setResourceCode("1234");      
        int resourceId=resource.getResourceId();        
     
        mockMvc.perform(put("/api/elements/" + resourceId)
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(resource))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));              
    }

    @Test
    @DisplayName("Delete Existing Resource without Admin Access")
    public void deleteExistingResourceWithoutAdminAccess() throws Exception {
        
        UserDetails user = this.userDetails.loadUserByUsername("user");
        ObjectMapper mapper = new ObjectMapper();

        Resource resource = resourceRepository.findByResourceName("newswitch");             
        int resourceId=resource.getResourceId();        
     
        mockMvc.perform(delete("/api/elements/" + resourceId)
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(resource))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is(403));              
    }

    @AfterAll
    public void tearDown() throws Exception {
        UserDetails user = this.userDetails.loadUserByUsername("admin");
        ObjectMapper mapper = new ObjectMapper();  

        Resource newResource = resourceRepository.findByResourceName("newswitch");             
        int newResourceId=newResource.getResourceId();        
        
        mockMvc.perform(delete("/api/elements/" + newResourceId)
                    .with(user(user))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(newResource))
                    .accept(MediaType.APPLICATION_JSON));
    }
}
