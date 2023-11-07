package com.blog.rest_blogapplication.Model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Catagory")
public class Catagory {

    @Id
    @Column(name = "Catagory_id")
    private int id;
    @Column(name = "Catagory_title")
    private String CatagoryTitle;
    @Column(name = "Catagory_description")
    private String Description;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCatagoryTitle() {
        return CatagoryTitle;
    }

    public void setCatagoryTitle(String catagoryTitle) {
        CatagoryTitle = catagoryTitle;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public Catagory(int id, String catagoryTitle, String description) {
        this.id = id;
        CatagoryTitle = catagoryTitle;
        Description = description;
    }

    @Override
    public String toString() {
        return "Catagory [id=" + id + ", CatagoryTitle=" + CatagoryTitle + ", Description=" + Description + "]";
    }

    public Catagory()
    {
        super();
    }
}
