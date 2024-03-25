package in.utl.noa.model;

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
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.client.MockMvcWebTestClient;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import in.utl.noa.config.WebMvcJpaAuthAthrTestConfig;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;

@WebMvcTest
@ContextConfiguration(classes = WebMvcJpaAuthAthrTestConfig.class)
@Configuration
@OverrideAutoConfiguration(enabled = false)
@ImportAutoConfiguration(value = { RepositoryRestMvcAutoConfiguration.class })
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ApiAccessTests {
     
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
    @DisplayName("Access Api with Logging In")
    public void accessApiWithLogin() throws Exception {
        
        UserDetails user = this.userDetails.loadUserByUsername("admin");
		
		mockMvc.perform( MockMvcRequestBuilders
				.get("/api/")
				.with(user(user))
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(MockMvcResultMatchers.status().is(200));
    }
    
    @Test
    @DisplayName("Access Api without Logging In") 
    public void accessApiWithoutLogin() throws Exception {
		
		mockMvc.perform( MockMvcRequestBuilders
				.get("/api/")
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(MockMvcResultMatchers.status().is(200));
    }
    
}