package com.fullstack.fullstack.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class BookModel {
 private String title;
 @Id 
 private Integer year;
public String getTitle() {
    return title;
}
public void setTitle(String title) {
    this.title = title;
}
public Integer getYear() {
    return year;
}
public void setYear(Integer year) {
    this.year = year;
}
@Override
public String toString() {
    return "BookModel [title=" + title + ", year=" + year + "]";
}
public BookModel(String title, Integer year) {
    this.title = title;
    this.year = year;
}
public BookModel()
{
    super();
}
}
