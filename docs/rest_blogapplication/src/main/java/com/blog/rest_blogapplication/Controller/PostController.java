package com.blog.rest_blogapplication.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.blog.rest_blogapplication.Payloads.PostDto;
import com.blog.rest_blogapplication.Service.PostService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
public class PostController 
{

@Autowired    
PostService postService;    

@RequestMapping(path = "/post",method = RequestMethod.POST)
public ResponseEntity<PostDto> createPost(@RequestBody PostDto postDto)
{
    try
    {
      postDto=postService.createPost(postDto);
      System.out.println("New post added"+" "+postDto);
      return new ResponseEntity<PostDto>(postDto,HttpStatus.CREATED);  
    }
    catch(Exception e)
    {
        return new ResponseEntity<>(HttpStatus.NOT_EXTENDED);
    }
}



}
