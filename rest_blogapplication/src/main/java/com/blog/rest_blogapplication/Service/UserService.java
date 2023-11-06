package com.blog.rest_blogapplication.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.blog.rest_blogapplication.Model.User;
import com.blog.rest_blogapplication.Repository.UserRepo;

@Service
@Component
public class UserService implements UserServiceInterface{

    @Autowired
    UserRepo userRepo;

    private int getMaxId()
    {
        return userRepo.findAll().size()+1;
    }

    @Override
    public User createUser(User user) 
    {
      user.setId(getMaxId());
      userRepo.save(user);
      return user;
    }

    @Override
    public List<User> getAllUser() 
    {
    List <User> getUser=userRepo.findAll();
    return getUser;   
    }

    @Override
    public User updateUser(User user) 
    {
     userRepo.save(user);
     return user;   
    }




    @Override
    public User getUserById(int id) 
    {
    List<User> getuserId=userRepo.findAll();
    User uid=null;
    for(User u: getuserId)
    {
        if(u.getId()==id)
        {
            uid=u;
        }
    } 
    return uid;
    }

    @Override
    public void deleteUser(User user) 
    {
    userRepo.delete(user);  
    }

    @Override
    public User getByname(String name) 
    {
    List<User> getUser=userRepo.findAll();
    User getName=null;
    for(User n: getUser)
    {
        if(n.getName().equalsIgnoreCase(name))
        {
            getName=n;
        }
    }
    return getName;
    }

    
    
}
