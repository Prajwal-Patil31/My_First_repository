package com.blog.rest_blogapplication.Payloads;


public class CatagoryDto 
{
private int id;
private String title;
private String description;


 

public int getId() {
    return id;
}




public void setId(int id) {
    this.id = id;
}




public String getTitle() {
    return title;
}




public void setTitle(String title) {
    this.title = title;
}




public String getDescription() {
    return description;
}




public void setDescription(String description) {
    this.description = description;
}




public CatagoryDto(int id, String title, String description) {
    this.id = id;
    this.title = title;
    this.description = description;
}




@Override
public String toString() {
    return "CatagoryDto [id=" + id + ", title=" + title + ", description=" + description + "]";
}




public CatagoryDto()
 {
    super();
 }   
}
