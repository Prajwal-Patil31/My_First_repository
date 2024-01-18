package com.blog.rest_blogapplication.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog.rest_blogapplication.Model.User;

@Repository
public interface UserRepo extends JpaRepository<User,Integer>{
    
}
