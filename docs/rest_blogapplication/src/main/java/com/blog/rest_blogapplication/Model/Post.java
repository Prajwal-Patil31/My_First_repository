package com.blog.rest_blogapplication.Model;

import java.time.LocalDateTime;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "Post_table")
public class Post {

    @Id
    private int postid;
    private String title;
    private String imagename;
    private LocalDateTime   adddate;
    private String content;


    
    @Override
    public String toString() {
        return "Post [postid=" + postid + ", title=" + title + ", imagename=" + imagename + ", adddate=" + adddate
                + ", content=" + content + ", catagory=" + catagory + ", user=" + user + "]";
    }



    public Post(int postid, String title, String imagename, LocalDateTime adddate, String content, Catagory catagory,
            User user) {
        this.postid = postid;
        this.title = title;
        this.imagename = imagename;
        this.adddate = adddate;
        this.content = content;
        this.catagory = catagory;
        this.user = user;
    }



    public int getPostid() {
        return postid;
    }



    public void setPostid(int postid) {
        this.postid = postid;
    }



    public String getTitle() {
        return title;
    }



    public void setTitle(String title) {
        this.title = title;
    }



    public String getImagename() {
        return imagename;
    }



    public void setImagename(String imagename) {
        this.imagename = imagename;
    }



    public LocalDateTime getAdddate() {
        return adddate;
    }



    public void setAdddate(LocalDateTime adddate) {
        this.adddate = adddate;
    }



    public String getContent() {
        return content;
    }



    public void setContent(String content) {
        this.content = content;
    }



    public Catagory getCatagory() {
        return catagory;
    }



    public void setCatagory(Catagory catagory) {
        this.catagory = catagory;
    }



    public User getUser() {
        return user;
    }



    public void setUser(User user) {
        this.user = user;
    }



    @ManyToOne
     @JoinColumn(name = "catagory_id")
    private Catagory catagory;
    
    @ManyToOne
    @JoinColumn(name = "User_id")
    private User user;

   

    public Post()
    {
        super();
    }

}
