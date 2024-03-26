package com.restapi.unit_test.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restapi.unit_test.Model.Country;

@Repository
public interface CountryRepository extends JpaRepository<Country,Integer>{
    
}
