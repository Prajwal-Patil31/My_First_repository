package com.noa.noa_practice.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.noa.noa_practice.Dto.UserDto;
import com.noa.noa_practice.Exception.ResourceNotFoundException;
import com.noa.noa_practice.Model.User;
import com.noa.noa_practice.Repository.UserRepo;

/**
 * This class provides services related to User entities.
 */
@Service
public class UserServiceImplementation implements UserService {

static Logger logger = LogManager.getLogger(UserServiceImplementation.class); 

    @Autowired
    private UserRepo userRepo;

    /**
     * Retrieves the maximum ID of users in the repository.
     * @return The maximum ID.
     */
    public Integer getMaxId() {
        return userRepo.findAll().size() + 1;
    }

    /**
     * Creates a new user from the given UserDto.
     * @param userDto The UserDto object containing user data.
     * @return The created UserDto object.
     */
    @Override
    public UserDto createUser(UserDto userDto) {
        User user = this.dtoToUser(userDto);
        User saveUser = this.userRepo.save(user);
        logger.info("Create user serviceImplementation class method called");
        return this.userToDto(saveUser);
    }

    /**
     * Updates an existing user with the given ID using the data from the provided UserDto.
     * @param userDto The UserDto object containing updated user data.
     * @param id The ID of the user to update.
     * @return The updated UserDto object.
     * @throws ResourceNotFoundException If the user with the given ID is not found.
     */
    @Override
    public UserDto updateUser(UserDto userDto, Integer id) {
        User user = this.userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setAbout(userDto.getAbout());
        User updatedUser = this.userRepo.save(user);
        logger.info("Update user serviceImplementation class method called");
        return this.userToDto(updatedUser);
    }

    /**
     * Retrieves the user with the specified ID.
     * @param id The ID of the user to retrieve.
     * @return The UserDto object representing the user.
     * @throws ResourceNotFoundException If the user with the given ID is not found.
     */
    @Override
    public UserDto getUserById(Integer id) {
        User user = this.userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "Id", id));
                logger.info("GetuserById serviceImplementation class method called");
        return this.userToDto(user);
    }

    /**
     * Retrieves all users in the repository.
     * @return A list of UserDto objects representing all users.
     */
    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = this.userRepo.findAll();
        logger.info("Getalluser serviceImplementation class method called");
        return users.stream().map(this::userToDto).collect(Collectors.toList());
    }

    /**
     * Deletes the user with the specified ID.
     * @param id The ID of the user to delete.
     * @throws ResourceNotFoundException If the user with the given ID is not found.
     */
    @Override
    public void deleteUserById(Integer id) {
        User user = this.userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "Id", id));
                logger.info("DeleteUserById serviceImplementation class method called");
        this.userRepo.delete(user);
    }

    /**
     * Converts a UserDto object to a User object.
     * @param userDto The UserDto object to convert.
     * @return The converted User object.
     */
    private User dtoToUser(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setAbout(userDto.getAbout());
        user.setPassword(userDto.getPassword());
        logger.info("DtoToUser serviceImplementation class method called");
        return user;
    }

    /**
     * Converts a User object to a UserDto object.
     * @param user The User object to convert.
     * @return The converted UserDto object.
     */
    public UserDto userToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setAbout(user.getAbout());
        userDto.setPassword(user.getPassword());
        logger.info("userToDto serviceImplementation class method called");
        return userDto;
    }
}
