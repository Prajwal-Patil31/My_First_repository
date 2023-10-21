package com.restapi.unit_test;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import com.restapi.unit_test.Model.Country;
import com.restapi.unit_test.Repository.CountryRepository;
import com.restapi.unit_test.Service.ServiceImplementation;


@SpringBootTest(classes = {ServiceImplementationTest.class})
public class ServiceImplementationTest {
    

    @Mock
    CountryRepository countryRepository;
    
    @InjectMocks
    private ServiceImplementation serviceImplementation;
  
    public List<Country> testCountries;

    @Test
    @Order(1)
    public void test_getAllCountries()
    {
    List<Country> testCountries =new ArrayList<Country>();
    testCountries.add(new Country(1, "India", "Delhi"));
    testCountries.add(new Country(2, "Canada", "Toronto"));
    Mockito.when(countryRepository.findAll()).thenReturn(testCountries);
    Assertions.assertEquals(2,serviceImplementation.getAllCountries().size());
    }
    
    @Test
    @Order(2)
    public void test_getByCountryId()
    {
     List<Country> testCountries=new ArrayList<Country>();
     testCountries.add(new Country(1, "United states", "Washington"));
     testCountries.add(new Country(2, "German", "Barlin"));
     int countryId=1;
     Mockito.when(countryRepository.findAll()).thenReturn(testCountries);
     Assertions.assertEquals(countryId,serviceImplementation.getByCountryId(countryId).getId());   
     }
    
     @Test
     @Order(3)
     public void test_getCountryByName()
     {
     List<Country> testCountries=new ArrayList<Country>();
     testCountries.add(new Country(1, "Bijapur", "Golgumbag"));
     testCountries.add(new Country(2, "Belagavi", "Anagol"));
     String countryName="Bijapur";
     Mockito.when(countryRepository.findAll()).thenReturn(testCountries);
     String actualCountryName=serviceImplementation.getCountryByName(countryName).getCountryName();
     Assertions.assertEquals(countryName,actualCountryName);
     }
    
     @Test
     @Order(4)
     public void test_addCountry()
     {
     Country country =new Country(1, "German", "Barlin");
     Mockito.when(countryRepository.save(country)).thenReturn(country);  
     Assertions.assertEquals(country,serviceImplementation.addCountry(country));
     }

     @Test
     @Order(5)
     public void test_updateCountry()
     {
     Country country =new Country(1, "German", "Barlin");
     Mockito.when(countryRepository.save(country)).thenReturn(country);  
     Assertions.assertEquals(country,serviceImplementation.updateCountry(country));
     }
     
     @Test
     @Order(6)
     public void test_deletCountryById()
     {
     Country country =new Country(1, "Japan", "Tokyo");
     serviceImplementation.deleteCountryById(country);
     verify(countryRepository,times(1)).delete(eq(country));
     }
}
