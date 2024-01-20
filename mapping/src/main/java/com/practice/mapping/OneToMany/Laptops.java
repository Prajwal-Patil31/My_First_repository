package com.practice.mapping.OneToMany;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "jpa_laptops")
public class Laptops {
    @Id
    private int laptopId;
    private String modelNumber;
    private String brand;

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student; //To manage bidirectional mapping hibernate will make foreign key in both the tables 

    public int getLaptopId() {
        return laptopId;
    }
    public void setLaptopId(int laptopId) {
        this.laptopId = laptopId;
    }
    public String getModelNumber() {
        return modelNumber;
    }
    public void setModelNumber(String modelNumber) {
        this.modelNumber = modelNumber;
    }
    public String getBrand() {
        return brand;
    }
    public void setBrand(String brand) {
        this.brand = brand;
    }
    @Override
    public String toString() {
        return "Laptops [laptopId=" + laptopId + ", modelNumber=" + modelNumber + ", brand=" + brand + ", student="
                + student + "]";
    }
   
    public Laptops(){
        super();
    }
    public Laptops(int laptopId, String modelNumber, String brand, Student student) {
        this.laptopId = laptopId;
        this.modelNumber = modelNumber;
        this.brand = brand;
        this.student = student;
    }
    public Student getStudent() {
        return student;
    }
    public void setStudent(Student student) {
        this.student = student;
    }
}
