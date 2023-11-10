package com.blog.rest_blogapplication.Model;

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
    private Date   adddate;
    private String content;

    @ManyToOne
     @JoinColumn(name = "catagory_id")
    private Catagory catagory;
    
    @ManyToOne
    @JoinColumn(name = "User_id")
    private User user;

    public Post(String content) {
        this.content = content;
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



    public Date getAdddate() {
        return adddate;
    }



    public void setAdddate(Date adddate) {
        this.adddate = adddate;
    }



    public Post(int postid, String title, String imagename, Date adddate) {
        this.postid = postid;
        this.title = title;
        this.imagename = imagename;
        this.adddate = adddate;
    }



    @Override
    public String toString() {
        return "Post [postid=" + postid + ", title=" + title + ", imagename=" + imagename + ", adddate=" + adddate
                + ", content=" + content + "]";
    }



    public Post()
    {
        super();
    }



    public String getContent() {
        return content;
    }



    public void setContent(String content) {
        this.content = content;
    }
    
}
