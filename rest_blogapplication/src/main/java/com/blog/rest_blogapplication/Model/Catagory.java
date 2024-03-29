package com.blog.rest_blogapplication.Model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "Catagory")
public class Catagory {

    @Id
    @Column(name = "Catagory_id")
    private int id;
    @Column(name = "Catagory_title")
    private String title;
    @Column(name = "Catagory_description")
    private String description;

    @OneToMany(mappedBy = "catagory", cascade = CascadeType.ALL)
    private List<Post> posts= new ArrayList<>();   

    public int getId() {
        return id;
    }



    public Catagory(List<Post> posts) {
        this.posts = posts;
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



    public Catagory(int id, String title, String description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }



    @Override
    public String toString() {
        return "Catagory [id=" + id + ", title=" + title + ", description=" + description + ", posts=" + posts + "]";
    }



    public Catagory()
    {
        super();
    }



    public List<Post> getPosts() {
        return posts;
    }



    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }
}
