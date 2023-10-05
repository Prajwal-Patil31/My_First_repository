package com.springbackend.backend.Controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springbackend.backend.Model.SpringModel;
import com.springbackend.backend.Repository.SpringRepo;

@RestController
@CrossOrigin("http://localhost:3000")
public class SpringController {

    @Autowired
    public SpringRepo springrepo;

    @PostMapping("/user")
    public SpringModel addNewuser(@RequestBody SpringModel springmodel) {
        return springrepo.save(springmodel);

    }

    @GetMapping("/users")
    public List<SpringModel> getAllUser() {
        return springrepo.findAll();

    }

    @GetMapping("/user/{id}")
    public Optional<SpringModel> getUserbyId(@PathVariable Long id) {
        return springrepo.findById(id);
    }

    @PutMapping("/user/{id}")
    public Optional<Object> updateUser(@RequestBody SpringModel springmodels, @PathVariable Long id) {
        return springrepo.findById(id).map(springmodel -> {
            springmodel.setAge(springmodels.getAge());
            springmodel.setAddress(springmodels.getAddress());
            springmodel.setName(springmodels.getName());
            return springrepo.save(springmodels);
        });

    }

    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable Long id) {
        springrepo.deleteById(id);
        System.out.println("User with " + id + " has deleted successfully");
        return "User with " + id + " has deleted successfully";
    }

}
