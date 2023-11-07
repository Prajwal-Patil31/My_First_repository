package com.blog.rest_blogapplication.Payloads;


public class CatagoryDto 
{
private int id;
private String Catagory_title;
private String Catagory_description;


 public int getId() {
    return id;
}


public void setId(int id) {
    this.id = id;
}


public String getCatagory_title() {
    return Catagory_title;
}


public void setCatagory_title(String catagory_title) {
    Catagory_title = catagory_title;
}


public String getCatagory_description() {
    return Catagory_description;
}


public void setCatagory_description(String catagory_description) {
    Catagory_description = catagory_description;
}


public CatagoryDto(int id, String catagory_title, String catagory_description) {
    this.id = id;
    Catagory_title = catagory_title;
    Catagory_description = catagory_description;
}


@Override
public String toString() {
    return "CatagoryDto [id=" + id + ", Catagory_title=" + Catagory_title + ", Catagory_description="
            + Catagory_description + "]";
}


public CatagoryDto()
 {
    super();
 }   
}
