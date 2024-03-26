package com.noa.noa_practice.Service;

import java.util.List;

import com.noa.noa_practice.Dto.UserDto;

public interface UserService 
{
public UserDto createUser(UserDto user);

public UserDto updateUser(UserDto user, Integer id);

public UserDto getUserById(Integer id);

public List<UserDto> getAllUsers();

public void deleteUserById(Integer id);

}
