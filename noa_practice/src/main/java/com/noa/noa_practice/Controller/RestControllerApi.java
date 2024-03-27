package com.noa.noa_practice.Controller;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import com.noa.noa_practice.Dto.UserDto;
import com.noa.noa_practice.Service.UserServiceImplementation;

/**
 * This class defines RESTful API endpoints for User-related operations.
 */
@RestController
@RequestMapping("api/users")
public class RestControllerApi {

    static Logger logger = LogManager.getLogger(RestControllerApi.class); 

    @Autowired
    private UserServiceImplementation userServiceImplementation;

    /**
     * Endpoint to create a new user.
     * @param userDto The UserDto object containing user data.
     * @return ResponseEntity with the created UserDto object and HTTP status 201 (CREATED).
     */
    @RequestMapping(path = "/createuser", method = RequestMethod.POST)
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        UserDto createUserDto = userServiceImplementation.createUser(userDto);
        logger.info("Create user controller class method called");
        return new ResponseEntity<>(createUserDto, HttpStatus.CREATED);
    }

    /**
     * Endpoint to update an existing user.
     * @param userDto The UserDto object containing updated user data.
     * @param id The ID of the user to update.
     * @return ResponseEntity with the updated UserDto object and HTTP status 200 (OK).
     */
    @RequestMapping(path = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto, @PathVariable Integer id) {
        UserDto updatedUserDto = userServiceImplementation.updateUser(userDto, id);
        logger.info("Update user controller class method called");
        return new ResponseEntity<>(updatedUserDto, HttpStatus.OK);
    }
    
    /**
     * Endpoint to delete a user by ID.
     * @param id The ID of the user to delete.
     * @return ResponseEntity with HTTP status 200 (OK).
     */
    @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<UserDto> deleteUser(@PathVariable(value = "id") Integer id) {
        userServiceImplementation.deleteUserById(id);
        logger.info("Delete user controller class method called");
        return ResponseEntity.ok().build();
    }
    
    /**
     * Endpoint to retrieve all users.
     * @return ResponseEntity with a list of UserDto objects representing all users and HTTP status 200 (OK).
     */
    @RequestMapping(path = "/getall", method = RequestMethod.GET)
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> userDtos = userServiceImplementation.getAllUsers();
        logger.info("Get all users controller class method called");
        return ResponseEntity.ok(userDtos);
    }
    
    /**
     * Endpoint to retrieve a user by ID.
     * @param id The ID of the user to retrieve.
     * @return ResponseEntity with the UserDto object representing the user and HTTP status 200 (OK).
     */
    @RequestMapping(path = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<UserDto> getUserById(@PathVariable Integer id) {
        logger.info("Get user by ID controller class method called");
        return ResponseEntity.ok(userServiceImplementation.getUserById(id));
    }
}
