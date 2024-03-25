package in.utl.noa.model;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
import org.springframework.util.Base64Utils;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import in.utl.noa.config.WebMvcJpaAuthAthrTestConfig;

@WebMvcTest
@ContextConfiguration(classes = WebMvcJpaAuthAthrTestConfig.class)
@Configuration
@OverrideAutoConfiguration(enabled = false)
@ImportAutoConfiguration(value = { RepositoryRestMvcAutoConfiguration.class })
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PasswordTests {
    
    @Autowired
    private UserAccountRepository userRepository;

    @Autowired
    private MockMvc mockMvc;
    
    public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

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
    @DisplayName("Password for New User should be in Encrypted Format")
    public void passwordShouldBeStoredInEncryptedFormat() throws Exception {
        
        UserAccount user = new UserAccount("pwdUser","password");

        ObjectMapper mapper = new ObjectMapper();
        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        mockMvc.perform(post("/api/security-users")
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(user))
                    .accept(MediaType.APPLICATION_JSON));
        
        UserAccount newUser = userRepository.findByUserName("pwdUser");
        String dbPassword = newUser.getPassword();
        /* String utf8EncodedString = new String(password.getBytes(StandardCharsets.UTF_8), StandardCharsets.UTF_8); */
        PasswordEncoder bcryptEncoder = new BCryptPasswordEncoder();

        boolean isPasswordMatched  = bcryptEncoder.matches("password", dbPassword);

        /* assertTrue((bcryptEncoder.encode("password")).equals(dbPassword)); */
        assertTrue(isPasswordMatched);
    }

    @AfterAll
    public void tearDown() throws Exception {
        UserDetails userDts = this.userDetails.loadUserByUsername("admin");

        ObjectMapper mapper = new ObjectMapper();

        UserAccount modifyUser = userRepository.findByUserName("pwdUser");
        int newAccountId = modifyUser.getAccountId();

        mockMvc.perform(delete("/api/security-users/" + newAccountId)
                    .with(user(userDts))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(modifyUser))
                    .accept(MediaType.APPLICATION_JSON));
    }
}
