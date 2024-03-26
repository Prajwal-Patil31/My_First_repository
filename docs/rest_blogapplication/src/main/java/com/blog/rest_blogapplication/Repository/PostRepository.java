package com.blog.rest_blogapplication.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog.rest_blogapplication.Model.Catagory;
import com.blog.rest_blogapplication.Model.Post;
import com.blog.rest_blogapplication.Model.User;

@Repository
public interface PostRepository extends JpaRepository<Post,Integer>
{
    public List<Post> findAllByUser(User user);

    public List<Post> findByCatagory(Catagory catagory);
}
