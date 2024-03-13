package com.practice.mapping.OneToMany;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainApplication 
{
@Autowired
private StudentService studentService;

@RequestMapping(path = "/addStudent",method = RequestMethod.POST)
public Student addStudent()
{
    return studentService.addStudent();
}

}


