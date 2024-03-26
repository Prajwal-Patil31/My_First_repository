package com.noa.noa_practice.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.noa.noa_practice.Dto.UserDto;
import com.noa.noa_practice.Model.User;
import com.noa.noa_practice.Repository.UserRepo;


@Service
public class UserServiceImplementation implements UserService
{

    @Autowired
    private UserRepo userRepo;

    public Integer getMaxId()
    {
     return userRepo.findAll().size()+1;
    }

    @Override
    public UserDto createUser(UserDto user) 
    {
        
    }

    @Override
    public UserDto updateUser(UserDto user, Integer id) 
    {

    }

    @Override
    public UserDto getUserById(Integer id) 
    {
       
    }

    @Override
    public List<UserDto> getAllUsers() 
    {
       
    }

    @Override
    public void deleteUserById(Integer id) 
    {

    }

    private User dtoToUser(UserDto userDto)
    {
      User user = new User(); 
      user.setId(userDto.getId());
      user.setName(userDto.getName());
      user.setEmail(userDto.getEmail());
      user.setAbout(userDto.getAbout());
      user.setPassword(userDto.getPassword());
      return user;
    }
    
    public UserDto userToDto(User user)
    {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setPassword(user.getPassword());
        return userDto;
    }
}
