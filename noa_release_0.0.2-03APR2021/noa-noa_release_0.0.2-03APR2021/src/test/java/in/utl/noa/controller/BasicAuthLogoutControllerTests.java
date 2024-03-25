package in.utl.noa.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeAll;

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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

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
public class BasicAuthLogoutControllerTests {
    
	@Autowired
	private MockMvc MockMvc;
	
	@Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserDetailsService userDetails;
    
    @BeforeAll
    public void setup() {
        MockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();
    }

    @Test
	@DisplayName("Perform BasicAuth Login")
	void performLogin() throws Exception {
        
        UserDetails user = this.userDetails.loadUserByUsername("admin");
        
        MockMvc.perform( MockMvcRequestBuilders
                    .get("/login")
                    .with(user(user))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().is(200));
    }

    @Test
	@DisplayName("Perform BasicAuth Logout")
	void performLogout() throws Exception {
        
        UserDetails user = this.userDetails.loadUserByUsername("admin");
        
        MockMvc.perform( MockMvcRequestBuilders
                    .get("/logout")
                    .with(user(user))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().is(200));
    }
}


































/* 
package in.utl.noa.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.MockMvcPrint;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.context.WebApplicationContext;
import org.junit.jupiter.api.DisplayName;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import org.junit.jupiter.api.BeforeAll;

@WebMvcTest
@ContextConfiguration
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest(class=BasicAuthLoginController) 


public class BasicAuthLogoutControllerTests {

	@Autowired
	private MockMvc MockMvc;
	
	@Autowired
    private WebApplicationContext wac;

    @BeforeAll
    public void setup()
    {
        MockMvc = MockMvcBuilders
            .webAppContextSetup(wac)
            .apply(springSecurity())
            .build();
    }
    @Test
    @WithMockUser(username = "admin", password = "pass", roles = "Administrator")
	@DisplayName("Perform BasicAuth Login")
    void CheckLogout() {
 
/*     public  loginWithIncorrectCredentials(final String username) throws Exception {
        mockMvc.perform(post("/api/login") */
  /*       void performLogout11(final String username, final String password) throws Exception {
            MockMvcPrint.perform( MockMvcRequestBuilders
                .accept(MediaType.APPLICATION_JSON)
                .param("username", "user")
                .param("password", "password"));
               // .andExpect(MockMvcResultMatchers.status().isOk()));
    }
       public void logout() throws Exception {
        /* mockMvc.perform(get("/api/logout")
                .with(userDetailsService("user"))
                .andExpect(status().isOk())); */
                /* MockMvcPrint.perform( MockMvcRequestBuilders
                .get("/logout")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().is(200));}

 /* performLogin(final String username; final String password) throws Exception{
		MockMvc.perform( MockMvcRequestBuilders
		.get("/login")
		.accept(MediaType.APPLICATION_JSON))
		.andExpect(MockMvcResultMatchers.status().is(200));	
    }
	@DisplayName("Perform BasicAuth Logout")
	void performLogout(final String username; final String password) throws Exception{
		MockMvcPrint.perform( MockMvcRequestBuilders
		.get("/logout")
		.accept(MediaType.APPLICATION_JSON))
		.andExpect(MockMvcResultMatchers.status().is(200));
	} */
 /*    public void performLogin(final String username, final String password) throws Exception {
        final ResultActions resultActions = this.mockMvc.perform(formLogin().user(username).password(password));
        this.assertSuccessLogin(resultActions);
    }

    public void performLogout() throws Exception {
        final ResultActions resultActions = this.mockMvc.perform(sessionLogout());
        this.assertSuccessLogout(resultActions);
    } */
