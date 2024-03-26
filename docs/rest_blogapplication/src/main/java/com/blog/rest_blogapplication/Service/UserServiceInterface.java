package com.blog.rest_blogapplication.Service;

import java.util.List;
import com.blog.rest_blogapplication.Payloads.UserDto;


public interface UserServiceInterface
{
   public UserDto createUser(UserDto userDto);
   
    public List<UserDto> getAllUser();

    public UserDto updateUser(UserDto userDto);

    public void deleteUser(UserDto userDto);

    public UserDto getUserById(int id);

    public UserDto getByname(String name);

}
