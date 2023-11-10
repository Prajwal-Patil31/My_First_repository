package com.blog.rest_blogapplication.Payloads;

import java.util.Date;

public class PostDto 
{
    private int postid;
    private String title;
    private String imagename;
    private Date   adddate;
    private String content;
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
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public PostDto(int postid, String title, String imagename, Date adddate, String content) {
        this.postid = postid;
        this.title = title;
        this.imagename = imagename;
        this.adddate = adddate;
        this.content = content;
    }
    @Override
    public String toString() {
        return "PostDto [postid=" + postid + ", title=" + title + ", imagename=" + imagename + ", adddate=" + adddate
                + ", content=" + content + "]";
    }
    
    public PostDto()
    {
        super();
    }
    
}
