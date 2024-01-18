package com.blog.rest_blogapplication.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog.rest_blogapplication.Model.Catagory;

@Repository
public interface CatagoryRepo extends JpaRepository<Catagory,Integer>
{
    
}
