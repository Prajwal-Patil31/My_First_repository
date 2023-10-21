package com.restapi.unit_test;

import static org.mockito.Answers.values;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.restapi.unit_test.Controller.MainController;
import com.restapi.unit_test.Model.Country;
import com.restapi.unit_test.Service.ServiceImplementation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@TestMethodOrder(OrderAnnotation.class)
@org.springframework.context.annotation.ComponentScan(basePackages={"com.restapi.unit_test"})
@AutoConfigureMockMvc
// @ContextConfiguration
@SpringJUnitConfig
@SpringBootTest(classes = {MainControllerMvcTest.class})
public class MainControllerMvcTest 
{
    @Autowired
    MockMvc mockMvc;
    
    @Mock
    private ServiceImplementation serviceImplementationTest;

    @InjectMocks
    private MainController mainControllerTest;
    
    List<Country> testCountry;

    Country country;

    @BeforeEach
    public void setUp()
    {
     mockMvc=MockMvcBuilders.standaloneSetup(mainControllerTest).build();
    }
    
    @Test
    @Order(1)
    public void test_getAllCountries() throws Exception
    {
    testCountry=new ArrayList<Country>();
    testCountry.add(new Country(1, "India", "Delhi"));
    testCountry.add(new Country(2, "Canada", "Toronto"));    
    Mockito.when(serviceImplementationTest.getAllCountries()).thenReturn(testCountry);
    this.mockMvc.perform(get("/countries")).andExpect(status().isFound()).andDo(print());
    }

    @Test
    @Order(2)
    public void test_getByCountryId() throws Exception
    {
     country=new Country(1, "United states", "Washington");
     int countryId=1;
     Mockito.when(serviceImplementationTest.getByCountryId(countryId)).thenReturn(country);
     this.mockMvc.perform(get("/countries/{id}",countryId)).andExpect(status().isFound())
     .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1))
     .andExpect(MockMvcResultMatchers.jsonPath("$.countryName").value("United states"))
     .andExpect(MockMvcResultMatchers.jsonPath("$.countryCapital").value("Washington"))
     .andDo(print());   
    }
    
    public void test_getCountryByName()
    {
        country=new Country(1, "Canada", "Toronto");
        String countryName="Canada";
        Mockito.when(serviceImplementationTest.getCountryByName(countryName)).thenReturn(country);
        this.mockMvc.perform(get("/countries/countryName")).
    }

}
