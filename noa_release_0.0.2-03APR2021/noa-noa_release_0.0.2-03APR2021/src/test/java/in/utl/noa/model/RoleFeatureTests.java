package in.utl.noa.model;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.opendaylight.infrautils.metrics.internal.Configuration;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.autoconfigure.ImportAutoConfiguration;

import org.springframework.boot.test.autoconfigure.OverrideAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import org.springframework.web.context.WebApplicationContext;

import org.springframework.test.context.ContextConfiguration;

import org.springframework.boot.autoconfigure.data.rest.RepositoryRestMvcAutoConfiguration;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import in.utl.noa.config.WebMvcJpaAuthAthrTestConfig;

@WebMvcTest
@ContextConfiguration(classes = WebMvcJpaAuthAthrTestConfig.class)
@Configuration
@OverrideAutoConfiguration(enabled = false)
@ImportAutoConfiguration(value = { RepositoryRestMvcAutoConfiguration.class })
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class RoleFeatureTests {
    
    @Autowired
    private RoleRepository repository;

    @Autowired
    private FeatureRepository featureRepository;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserDetailsService userDetails;
    
    @BeforeAll
    public void setup() {
        mvc = MockMvcBuilders
        .webAppContextSetup(wac)
        .apply(springSecurity())
        .build();
    }

    @Test
    @DisplayName("Adding Feature to Role")
    public void addingNewFeatureToRole() throws Exception {

        Feature feature = featureRepository.findByFeatureName("AlarmManagement");
        List<Feature> featureList = new ArrayList<Feature>();
        featureList.add(feature);
        
        Role role = repository.findByRoleName("Intern");
        int roleId = role.getRoleId();
        role.setFeatures(featureList);

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        mvc.perform(put("/api/security-roles/" + roleId + "/features")
                            .with(user(user))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(role))
                            .accept(MediaType.APPLICATION_JSON));
        
        List<Feature> updFeature = role.getFeatures();
        assertTrue(updFeature.contains(feature));

    }

    @Test
    @DisplayName("Deleting a Feature of a Role")
    public void deletingExistingFeatureOfRole() throws Exception {
        
        Feature feature = featureRepository.findByFeatureName("ConfigManagement");
        Feature feature1 = featureRepository.findByFeatureName("AlarmManagement");
        List<Feature> featureList = new ArrayList<Feature>();
        featureList.add(feature);
        featureList.add(feature1);

        Role role = repository.findByRoleName("Intern");
        int roleId = role.getRoleId();
        role.setFeatures(featureList);

        UserDetails user = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        //Operation for Adding a Feature to a Role
        mvc.perform(put("/api/security-roles/" + roleId + "/features")
                            .with(user(user))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(role))
                            .accept(MediaType.APPLICATION_JSON));

        List<Feature> updFeature = role.getFeatures();
        updFeature.remove(feature1);
        role.setFeatures(updFeature);

        //Operation for Deleting the Feature
        mvc.perform(delete("/api/security-roles/" + roleId + "/features")
                            .with(user(user))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(role))
                            .accept(MediaType.APPLICATION_JSON));
                            
        List<Feature> finalFeature = role.getFeatures();
        assertTrue(finalFeature.contains(feature));
        assertFalse(finalFeature.contains(feature1));
    }
}
