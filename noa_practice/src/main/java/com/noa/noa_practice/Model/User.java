package com.noa.noa_practice.Model;

import javax.annotation.Generated;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * This class represents a User entity in the application.
 */
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue (strategy = GenerationType.SEQUENCE)
    @Column(name = "user_id")
    private int id;
    
    @Column(name = "user_name")
    private String name;
    
    @Column(name = "user_email")
    private String email;
    
    @Column(name = "user_password")
    private String password;
    
    @Column(name = "about_user")
    private String about;

    /**
     * Retrieves the ID of the user.
     * @return The user's ID.
     */
    public int getId() {
        return id;
    }

    /**
     * Sets the ID of the user.
     * @param id The ID to set.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Retrieves the name of the user.
     * @return The user's name.
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the name of the user.
     * @param name The name to set.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Retrieves the email of the user.
     * @return The user's email.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the email of the user.
     * @param email The email to set.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Retrieves the password of the user.
     * @return The user's password.
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the password of the user.
     * @param password The password to set.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Retrieves the "about" description of the user.
     * @return The user's "about" description.
     */
    public String getAbout() {
        return about;
    }

    /**
     * Sets the "about" description of the user.
     * @param about The "about" description to set.
     */
    public void setAbout(String about) {
        this.about = about;
    }

    /**
     * Constructs a new User object with specified parameters.
     * @param id The ID of the user.
     * @param name The name of the user.
     * @param email The email of the user.
     * @param password The password of the user.
     * @param about The "about" description of the user.
     */
    public User(int id, String name, String email, String password, String about) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.about = about;
    }

    /**
     * Default constructor for the User class.
     */
    public User() {
        super();
    }

    /**
     * Returns a string representation of the User object.
     * @return A string representation including all user attributes.
     */
    @Override
    public String toString() {
        return "User [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", about=" + about
                + "]";
    }
}
