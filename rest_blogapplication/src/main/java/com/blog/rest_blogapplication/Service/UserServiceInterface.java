package com.blog.rest_blogapplication.Service;

import java.util.List;

import com.blog.rest_blogapplication.Model.User;


public interface UserServiceInterface
{
   public User createUser(User user);
   
   public List<User> getAllUser();

   public User updateUser(User user);

   public void deleteUser(User user);

   public User getUserById(int id);

   public User getByname(String name);

}
