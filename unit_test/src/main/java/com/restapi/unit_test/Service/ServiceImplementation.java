  package com.restapi.unit_test.Service;

  import java.util.List;

  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.stereotype.Component;
  import org.springframework.stereotype.Service;

  import com.restapi.unit_test.Model.Country;
  import com.restapi.unit_test.Repository.CountryRepository;

  @Service
  @Component 
   public class ServiceImplementation implements ServiceInterface {
  @Autowired
  private CountryRepository countryRepository;

      @Override
      public List<Country> getAllCountries() {
        List<Country> countries = countryRepository.findAll();
        return countries;
      }
  //method to add id one by one
       public int getMaxId()
      {
        return countryRepository.findAll().size()+1;
      }
      @Override
      public Country addCountry(Country country) 
      {
      country.setId(getMaxId());
      countryRepository.save(country);
      return country;
      }

      @Override
      public Country getByCountryId(int id) {
      List<Country> countries = countryRepository.findAll();
      Country country=null;
      for (Country c: countries)
      {
      if(c.getId()==id)
      {
      country =c;
      }
      }   
      return country;
      }

      @Override
      public Country getCountryByName(String countryName) {
        List<Country> countries = countryRepository.findAll();
        Country country =null;
        for(Country c: countries)
        {
          if(c.getCountryName().equalsIgnoreCase(countryName))
          {
              country=c;
          }
        }
        return country;
      }

      @Override
      public Country updateCountry(Country country) {
        countryRepository.save(country);
        return country;
      }

      @Override
      public void deleteCountryById(Country country) {
      countryRepository.delete(country);   
      }
      
  }

