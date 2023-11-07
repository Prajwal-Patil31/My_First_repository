package com.blog.rest_blogapplication.Service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;     
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.blog.rest_blogapplication.Model.User;
import com.blog.rest_blogapplication.Payloads.UserDto;
import com.blog.rest_blogapplication.Repository.UserRepo;

@Service
@Component
public class UserService implements UserServiceInterface{

    @Autowired
    UserRepo userRepo;

    @Autowired
    ModelMapper modelMapper;

    private int getMaxId()
    {
        return userRepo.findAll().size()+1;
    }

    @Override
    public UserDto createUser(UserDto userDto) 
    {
      userDto.setId(getMaxId());
      User newUser =modelMapper.map(userDto,User.class);

      userRepo.save(newUser);
      return userDto;
    }

    @Override
    public List<UserDto> getAllUser() 
    {
    List<User> user=userRepo.findAll();
    List <UserDto> getAlluser=new ArrayList<>();
    for(User u: user)
    {
    getAlluser.add(userDto(u));
    }
    return getAlluser;   
    }

    @Override
    public UserDto updateUser(UserDto userDto) 
    {
    User newUser =modelMapper.map(userDto, User.class);
    userRepo.save(newUser);
    return userDto;   
    }




    @Override
    public UserDto getUserById(int id) 
    {
       List <User> user =userRepo.findAll();
        User uid=null;
        for(User u: user)
        {
        if(u.getId()==id)
        {
        uid=u;
        }
    } 
    return userDto(uid);
    }

    @Override
    public void deleteUser(UserDto userDto) 
    {
    User newUser=modelMapper.map(userDto,User.class);    
    userRepo.delete(newUser);  
    }

    @Override
    public UserDto getByname(String name) 
    {
    List<User> getUser=userRepo.findAll();
    User getname=null;
    for(User n: getUser)
    {
        if(n.getName().equalsIgnoreCase(name))
        {
            getname=n;
        }
    }
    return userDto(getname);
    }


    //Model mapper implementation
    public User dtoToUser(UserDto userDto)
    {
     User user= this.modelMapper.map(userDto,User.class);//here we are converting user dto to user.class.
    //Two things we need to provide source which object need to be converted and in which class this object need to be converted.
    return user;
    }
    
    public UserDto userDto(User user)
    {
    UserDto dto=this.modelMapper.map(user,UserDto.class);
    return dto;
    }

    
}
