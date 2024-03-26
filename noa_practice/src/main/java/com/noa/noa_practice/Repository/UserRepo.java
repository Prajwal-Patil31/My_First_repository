package com.noa.noa_practice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.noa.noa_practice.Model.User;

@Repository
public interface UserRepo extends JpaRepository<User,Integer>
{
    
}
