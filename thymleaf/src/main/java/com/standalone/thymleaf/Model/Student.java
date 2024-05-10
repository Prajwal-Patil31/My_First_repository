package com.standalone.thymleaf.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Student 
{
@Id
private Integer Id;
private String name;
private  String lastname;
public Integer getId() {
    return Id;
}
public void setId(Integer id) {
    Id = id;
}
public String getName() {
    return name;
}
public void setName(String name) {
    this.name = name;
}
public String getLastname() {
    return lastname;
}
public void setLastname(String lastname) {
    this.lastname = lastname;
}
public Student(Integer id, String name, String lastname) {
    Id = id;
    this.name = name;
    this.lastname = lastname;
}
@Override
public String toString() {
    return "Student [Id=" + Id + ", name=" + name + ", lastname=" + lastname + "]";
}
public Student()
{
    super();
}

}
