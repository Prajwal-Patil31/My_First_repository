package com.restapi.unit_test;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.restapi.unit_test.Controller.MainController;
import com.restapi.unit_test.Model.Country;
import com.restapi.unit_test.Service.ServiceImplementation;



@SpringBootTest(classes = {MainControllerTest.class})
public class MainControllerTest {

@Mock
private ServiceImplementation serviceImplementationTest;

@InjectMocks
private MainController mainControllerTest;

List<Country> testCountry;

Country country;

@Test
@Order(1)
public void testgetAllCountries()
{
testCountry = new ArrayList<Country>();
testCountry.add(new Country(1, "India", "Delhi"));
testCountry.add(new Country(2, "Unitedstates", "Washington"));
Mockito.when(serviceImplementationTest.getAllCountries()).thenReturn(testCountry);
ResponseEntity<List<Country>> res=mainControllerTest.getAllCountries();
Assertions.assertEquals(HttpStatus.FOUND,res.getStatusCode());
Assertions.assertEquals(2,res.getBody().size());
}

@Test
@Order(2)
public void testgetByCountryId()
{
country = new Country(2, "United States", "Washington");
int countryId =2;
Mockito.when(serviceImplementationTest.getByCountryId(countryId)).thenReturn(country);
ResponseEntity<Country> res=mainControllerTest.getByCountryId(countryId);
Assertions.assertEquals(HttpStatus.FOUND,res.getStatusCode());
Assertions.assertEquals(countryId,res.getBody().getId());
}

@Test
@Order(3)
public void testupdateCountry()
{
country= new Country(3,"Japan", "Tokyo");
int countryId=3;
Mockito.when(serviceImplementationTest.getByCountryId(countryId)).thenReturn(country);
Mockito.when(serviceImplementationTest.updateCountry(country)).thenReturn(country);
ResponseEntity<Country> res = mainControllerTest.updateCountry(countryId, country);
Assertions.assertEquals(HttpStatus.OK, res.getStatusCode());
Assertions.assertEquals(3,res.getBody().getId());
Assertions.assertEquals("Japan",res.getBody().getCountryName());
Assertions.assertEquals("Tokyo",res.getBody().getCountryCapital());
}
}
