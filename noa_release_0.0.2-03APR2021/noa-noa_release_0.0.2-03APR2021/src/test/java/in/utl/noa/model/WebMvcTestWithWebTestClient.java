package in.utl.noa.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.client.MockMvcWebTestClient;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.http.MediaType;

import in.utl.noa.config.WebMvcBaseTestConfig;
import in.utl.noa.controller.UserProfileContoller;

@WebMvcTest(controllers = UserProfileContoller.class)
@ContextConfiguration(classes = WebMvcBaseTestConfig.class)
public class WebMvcTestWithWebTestClient {
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private WebApplicationContext wac;

    /* @Autowired
    private UserProfileContoller upc; */

    private WebTestClient webTestClient;

    @BeforeEach
    public void setup() {

        this.webTestClient = MockMvcWebTestClient
        .bindToApplicationContext(wac)
        /* .filter(logRequest()) */
        .build();
    }

    @Test
    @WithMockUser(username = "admin")
    void listRestApi() throws Exception {

        this.webTestClient
        .get()
        .uri("/api/profile")
        .exchange()
        .expectStatus().is2xxSuccessful();
    }

    private ExchangeFilterFunction logRequest() {
        return (clientRequest, next) -> {
        System.out.printf("Request: %s %s %n", clientRequest.method(), clientRequest.url());
        return next.exchange(clientRequest);
        };
    }
}
