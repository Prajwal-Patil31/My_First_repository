package com.noa.noa_practice.Service;

import java.util.List;

import com.noa.noa_practice.Dto.UserDto;

/**
 * This interface defines the contract for services related to User entities.
 */
public interface UserService {

    /**
     * Creates a new user with the provided user data.
     * @param user The UserDto object containing user data.
     * @return The created UserDto object.
     */
    public UserDto createUser(UserDto user);

    /**
     * Updates an existing user with the provided user data.
     * @param user The UserDto object containing updated user data.
     * @param id The ID of the user to update.
     * @return The updated UserDto object.
     */
    public UserDto updateUser(UserDto user, Integer id);

    /**
     * Retrieves a user by their ID.
     * @param id The ID of the user to retrieve.
     * @return The UserDto object representing the user.
     */
    public UserDto getUserById(Integer id);

    /**
     * Retrieves a list of all users.
     * @return A list of UserDto objects representing all users.
     */
    public List<UserDto> getAllUsers();

    /**
     * Deletes a user by their ID.
     * @param id The ID of the user to delete.
     */
    public void deleteUserById(Integer id);

}
