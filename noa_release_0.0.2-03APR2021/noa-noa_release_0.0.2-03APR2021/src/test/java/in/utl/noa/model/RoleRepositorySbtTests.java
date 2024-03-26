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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.context.annotation.FilterType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import org.springframework.web.context.WebApplicationContext;

import in.utl.noa.config.FaultIntegrationConfig;
import in.utl.noa.config.WebMvcBaseTestConfig;
import in.utl.noa.service.MDSALService;

import org.springframework.http.MediaType;

@SpringBootTest
@AutoConfigureMockMvc
@ContextConfiguration(classes = WebMvcBaseTestConfig.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@WithMockUser(username = "admin", password = "pass", roles = "Administrator")
public class RoleRepositorySbtTests {
    @Autowired
    private MockMvc mvc;
    
    @Autowired
    private WebApplicationContext wac;

    @BeforeAll
    public void setup()
    {
        mvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();
    }

    @Test
    @DisplayName("Validate Default Roles with @SpringBootTest")
    public void validateDefaultRoles() throws Exception 
    {
        mvc.perform( MockMvcRequestBuilders
            .get("/api/security-roles")
            .accept(MediaType.APPLICATION_JSON))
            .andDo(MockMvcResultHandlers.print())
            .andExpect(MockMvcResultMatchers.status().isOk());
            //.andExpect(MockMvcResultMatchers.jsonPath("$._embedded[security-roles]").exists())
            //.andExpect(MockMvcResultMatchers.jsonPath("$._embedded[security-roles][*].roleId").isNotEmpty());
    }
}