package com.blog.rest_blogapplication.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.blog.rest_blogapplication.Model.User;
import com.blog.rest_blogapplication.Service.UserService;

@RestController
public class UserController 
{

 @Autowired   
 UserService userService;   

 @RequestMapping(path = "/user",method = RequestMethod.POST)
public ResponseEntity<User> createUser(@RequestBody User user)
{
   try
   {
   user=userService.createUser(user);
   System.out.println("New user added"+" "+user);
   return new ResponseEntity<User>(user,HttpStatus.CREATED);
   }
   catch(Exception e)
   {
    return new ResponseEntity<>(HttpStatus.CONFLICT);
   } 
}

@RequestMapping(path = "/userget",method = RequestMethod.GET)
public ResponseEntity<List<User>> getAllUser()
{
    try
    {
        List<User> getUser =userService.getAllUser();
        System.out.println("Found all users"+" "+getUser);
        return new ResponseEntity<List<User>>(getUser,HttpStatus.FOUND);
    }
    catch(Exception e)
    {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

@RequestMapping(path = "/user/{id}",method = RequestMethod.GET)
public ResponseEntity<User> getUserById(@PathVariable (value = "id") int id)
{
    try
    {
        User getId=userService.getUserById(id);
        System.out.println("Found user by id"+" "+getId);
        return new ResponseEntity<User>(getId,HttpStatus.ACCEPTED);
    }
    catch(Exception e)
    {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}

}
