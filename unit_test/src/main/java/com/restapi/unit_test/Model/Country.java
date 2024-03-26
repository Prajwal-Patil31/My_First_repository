package com.restapi.unit_test.Model;

import org.springframework.hateoas.RepresentationModel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Countries")
public class Country extends RepresentationModel<Country>{

    @Id
    @Column(name = "ID")
    int id;
    @Column(name = "Country Name")
    String countryName;
    @Column(name = "Country Capital")
    String countryCapital;
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getCountryName() {
        return countryName;
    }
    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }
    public String getCountryCapital() {
        return countryCapital;
    }
    public void setCountryCapital(String countryCapital) {
        this.countryCapital = countryCapital;
    }
    @Override
    public String toString() {
        return "Country [id=" + id + ", countryName=" + countryName + ", countryCapital=" + countryCapital + "]";
    }
    
    public Country(int id, String countryName, String countryCapital) {
        this.id = id;
        this.countryName = countryName;
        this.countryCapital = countryCapital;
    }
    public Country(){
        super();
    }
}
