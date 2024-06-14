package com.practice.thymleaf_pract.Model;

public class Employee {
    private int id;
    private String name;
    private String mob;
    private double salary;
    
    public Employee(double salary) {
        this.salary = salary;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getMob() {
        return mob;
    }
    public void setMob(String mob) {
        this.mob = mob;
    }
    public Employee(int id, String name, String mob) {
        this.id = id;
        this.name = name;
        this.mob = mob;
    }
    @Override
    public String toString() {
        return "Employee [id=" + id + ", name=" + name + ", mob=" + mob + ", salary=" + salary + "]";
    }
    public Employee()
    {
        super();
    }
    public double getSalary() {
        return salary;
    }
    public void setSalary(double salary) {
        this.salary = salary;
    }
}
