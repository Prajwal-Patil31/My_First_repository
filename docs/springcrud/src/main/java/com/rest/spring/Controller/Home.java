package com.rest.spring.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.rest.spring.Model.Student;
import com.rest.spring.Service.Serviceimple;

@RestController
public class Home {

    @Autowired
    private Serviceimple serviceimp;

    @RequestMapping(path = "/student", method = RequestMethod.GET)
    public List<Student> fetchAll() {
        return this.serviceimp.fetchAll();
    }

    @RequestMapping(path = "/student/{studentId}", method = RequestMethod.GET)
    public Optional<Student> getStudentbyID(@PathVariable Integer studentId) {
        return this.serviceimp.getStudentbyId(studentId);
    }

    @RequestMapping(path = "/student", method = RequestMethod.POST)
    public Student addStudent(@RequestBody Student student) {
        return this.serviceimp.addStudent(student);
    }

    @RequestMapping(path = "/student", method = RequestMethod.PUT)
    public Student updateStudent(@RequestBody Student student) {
        return this.serviceimp.updaStudent(student);
    }

    @RequestMapping(path = "/student/{studentId}", method = RequestMethod.DELETE)
    public void deleteStudent(@PathVariable Integer studentId) {
        this.serviceimp.deleteStudent(studentId);
    }
}
