package com.blog.rest_blogapplication.Controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.blog.rest_blogapplication.Payloads.UserDto;
import com.blog.rest_blogapplication.Service.UserService;

@RestController
@Validated
public class UserController 
{

 @Autowired   
 UserService userService;   

 @RequestMapping(path = "/user",method = RequestMethod.POST)
public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto)
{
   try
   {
   userDto=userService.createUser(userDto);
   System.out.println("New user added"+" "+userDto);
   return new ResponseEntity<UserDto>(userDto,HttpStatus.CREATED);
   }
   catch(Exception e)
   {
    return new ResponseEntity<>(HttpStatus.CONFLICT);
   } 
}

@RequestMapping(path = "/userget",method = RequestMethod.GET)
public ResponseEntity<List<UserDto>> getAllUser()
{
    try
    {
        List<UserDto> getUser =userService.getAllUser();
        System.out.println("Found all users"+" "+getUser);
        return new ResponseEntity<List<UserDto>>(getUser,HttpStatus.FOUND);
    }
    catch(Exception e)
    {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

@RequestMapping(path = "/user/{id}",method = RequestMethod.GET)
public ResponseEntity<UserDto> getUserById(@PathVariable (value = "id") int id)
{
    try
    {
        UserDto getId=userService.getUserById(id);
        System.out.println("Found user by id"+" "+getId);
        return new ResponseEntity<UserDto>(getId,HttpStatus.ACCEPTED);
    }
    catch(Exception e)
    {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}

@RequestMapping(path = "/user/{id}",method = RequestMethod.DELETE)
public ResponseEntity<UserDto> deleteUser(@PathVariable (value="id") int id)
{
UserDto userDto=null;
try
{
userDto=userService.getUserById(id);
userService.deleteUser(userDto);
System.out.println("User removed successfully"+" "+userDto);
return new ResponseEntity<UserDto>(userDto,HttpStatus.GONE);
}
catch(Exception e)
{
return new ResponseEntity<>(HttpStatus.NOT_FOUND);
}
}

@RequestMapping(path = "/user/username",method = RequestMethod.GET)
public ResponseEntity<UserDto> getByname(@RequestParam (value ="name") String username)
{
try
{
UserDto userDto = userService.getByname(username);
System.out.println("Found user by name"+" "+userDto);
return new ResponseEntity<UserDto>(userDto,HttpStatus.FOUND);
}
catch(Exception e)
{
return new ResponseEntity<>(HttpStatus.NOT_FOUND);
}
} 

@RequestMapping(path = "/user/{id}",method = RequestMethod.PUT)
public ResponseEntity<UserDto> updateUser(@Valid @PathVariable (value = "id") int id,@RequestBody UserDto userDto)
{
try
{
UserDto existingUser = userService.getUserById(id);
System.out.println("Existing user"+" "+existingUser);
if(userDto.getName() !=null && !userDto.getName().isEmpty())
{
existingUser.setName(userDto.getName());    
}
if(userDto.getEmail() !=null && !userDto.getEmail().isEmpty())
{
existingUser.setEmail(userDto.getEmail());
}
if(userDto.getPassword() !=null && !userDto.getPassword().isEmpty())
{
existingUser.setPassword(userDto.getPassword()); 
}
if(userDto.getAbout() !=null && !userDto.getAbout().isEmpty())
{
existingUser.setAbout(userDto.getAbout());
}
 UserDto updated_User=userService.updateUser(existingUser);
System.out.println("Updated user"+" "+updated_User);
return new ResponseEntity<UserDto>(updated_User,HttpStatus.ACCEPTED);
}
catch(Exception e)
{
return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
}
}

}
