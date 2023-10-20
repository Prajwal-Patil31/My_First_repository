package com.restapi.unit_test.Controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restapi.unit_test.Model.Country;
import com.restapi.unit_test.Repository.CountryRepository;
import com.restapi.unit_test.Service.ServiceImplementation;

@RestController
public class MainController {
    
@Autowired
private ServiceImplementation serviceImplementation;


@RequestMapping(path = "/countries",method = RequestMethod.GET)
public ResponseEntity<List<Country>> getAllCountries()
{
try
{
List<Country> countries=serviceImplementation.getAllCountries();
return new ResponseEntity<List<Country>>(countries,HttpStatus.FOUND);
}
catch(Exception e)
{
return new ResponseEntity<>(HttpStatus.NOT_FOUND);
}
}

@RequestMapping(path = "/addcountries",method = RequestMethod.POST)
public ResponseEntity<Country> addCountry(@RequestBody Country country)
{
try
{
country= serviceImplementation.addCountry(country);
return new ResponseEntity<Country>(country,HttpStatus.CREATED);
}
catch(NoSuchElementException e)
{
return new ResponseEntity<>(HttpStatus.CONFLICT);
}
}

@RequestMapping(path = "/countries/{id}",method = RequestMethod.GET)
public ResponseEntity<Country> getByCountryId(@PathVariable (value = "id") int id)
{
try
{
Country country =serviceImplementation.getByCountryId(id);
return new ResponseEntity<Country>(country,HttpStatus.FOUND);
}
catch(Exception e)
{
    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
}
}

@RequestMapping(path = "/countries/countryName",method = RequestMethod.GET)
public ResponseEntity<Country> getCountryByName(@RequestParam (value = "name") String countryName)
{
try
{
   Country country =serviceImplementation.getCountryByName(countryName); 
return new ResponseEntity<Country>(country,HttpStatus.FOUND);
}
catch(NoSuchElementException e)
{
return new ResponseEntity<>(HttpStatus.NOT_FOUND);
}
}

@RequestMapping(path = "/countries/{id}",method = RequestMethod.PUT)
public ResponseEntity<Country> updateCountry(@PathVariable(value = "id") int id,@RequestBody Country country)
{
try
{
Country existingCountry =serviceImplementation.getByCountryId(id);
existingCountry.setCountryName(country.getCountryName());
existingCountry.setCountryCapital(country.getCountryCapital());
Country updat_Country =serviceImplementation.updateCountry(existingCountry);
return new ResponseEntity<Country>(updat_Country,HttpStatus.OK);    
}
catch (Exception e)
{
return new ResponseEntity<>(HttpStatus.CONFLICT);
}    
}

@RequestMapping(path = "/countries/{id}",method = RequestMethod.DELETE)
public ResponseEntity<Country> deleteCountryById(@PathVariable (value = "id") int id)
{
Country country =null;
try
{
country=serviceImplementation.getByCountryId(id);
serviceImplementation.deleteCountryById(country);
}
catch(NoSuchElementException e)
{
return new ResponseEntity<>(HttpStatus.NOT_FOUND);    
}
return new ResponseEntity<Country>(country,HttpStatus.OK);    
}
}
