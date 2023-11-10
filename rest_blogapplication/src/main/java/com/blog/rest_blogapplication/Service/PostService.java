package com.blog.rest_blogapplication.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.rest_blogapplication.Model.Post;
import com.blog.rest_blogapplication.Payloads.PostDto;
import com.blog.rest_blogapplication.Repository.CatagoryRepo;
import com.blog.rest_blogapplication.Repository.PostRepository;
import com.blog.rest_blogapplication.Repository.UserRepo;

@Service
public class PostService implements PostInterface{

@Autowired
PostRepository postRepository;

@Autowired
ModelMapper modelMapper;

@Autowired
CatagoryRepo catagoryRepo;

@Autowired
UserRepo userRepo;

private int getMaxid()
{
return postRepository.findAll().size()+1;
}
    
private void currentDate()
{
    SimpleDateFormat format=new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
    Date =new Date();
}

    //Converting from postdto to post
    public Post dtoTopost(PostDto postDto)
    {
        Post post=this.modelMapper.map(postDto, Post.class);
        return post;
    }

    //Converting from postdto to post
    public PostDto postTodDto(Post post)
    {
        PostDto postDto=this.modelMapper.map(post, PostDto.class);
        return postDto;
    }

    @Override
    public PostDto createPost(PostDto postDto) 
    {
    postDto.setPostid(getMaxid());
    postDto.setAdddate(postDto.getAdddate());
    Post newPost=modelMapper.map(postDto, Post.class);
    postRepository.save(newPost);
    return postDto;
    }

    @Override
    public PostDto updatePost(PostDto postDto) 
    {
    Post newPostupdate = modelMapper.map(postDto, Post.class);
    postRepository.save(newPostupdate);
    return postDto;
    }

    @Override
    public void deletePost(PostDto postDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deletePost'");
    }

    @Override
    public List<Post> getAllPost() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllPost'");
    }

    @Override
    public Post getbyid(int id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getbyid'");
    }

    @Override
    public List<Post> getPostByCatagory(int id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getPostByCatagory'");
    }

    @Override
    public List<Post> getPostbyuser(int id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getPostbyuser'");
    }

    @Override
    public List<Post> searchpost(String name) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'searchpost'");
    }

    
}
