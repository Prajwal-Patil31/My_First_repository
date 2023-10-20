package com.restapi.unit_test.Service;

import java.util.List;

import com.restapi.unit_test.Model.Country;

public interface ServiceInterface{

    public List<Country> getAllCountries();

    public Country addCountry(Country country);

    public Country getByCountryId(int id);

    public Country getCountryByName(String countryName);

    public Country updateCountry(Country country);

    public void deleteCountryById(Country country);
}
