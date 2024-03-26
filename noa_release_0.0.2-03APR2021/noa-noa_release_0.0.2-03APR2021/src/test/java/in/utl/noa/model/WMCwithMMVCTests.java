package in.utl.noa.model;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.client.MockMvcWebTestClient;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import in.utl.noa.config.WebMvcBaseTestConfig;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@WebMvcTest
@AutoConfigureMockMvc
@ContextConfiguration(classes = WebMvcBaseTestConfig.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class WMCwithMMVCTests {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private WebApplicationContext wac;
    
    private WebTestClient webTestClient;
    
    @BeforeAll
    public void setup() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();

        this.webTestClient = MockMvcWebTestClient
        .bindTo(mockMvc)
        .build();
    }
    
    @Test
    @WithMockUser(username = "admin", password = "pass", roles = "Administrator")
    void validateRoleUpdate() {
        
        this.webTestClient
        .get()
        .uri("/api/security-roles")
        .exchange()
        .expectStatus().is2xxSuccessful();
    }
}
