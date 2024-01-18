package com.blog.rest_blogapplication.Service;

import java.util.List;

import com.blog.rest_blogapplication.Model.Post;
import com.blog.rest_blogapplication.Payloads.PostDto;

public interface PostInterface 
{
    //Add post
    public PostDto createPost(PostDto postDto);

    //Update 
    public PostDto updatePost(PostDto postDto);

    //Delete
    public void deletePost(PostDto postDto);

    //Get all post
    public List<Post> getAllPost();

    //Get post by id
    public Post getbyid(int id);

    //Get post by Catagory id
    public List<Post> getPostByCatagory(int id);

    //Get post by User id
    public List<Post> getPostbyuser(int id);

    //Search post 
    public List<Post> searchpost(String name);

}
