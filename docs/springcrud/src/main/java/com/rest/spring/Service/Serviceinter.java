package com.rest.spring.Service;

import java.util.List;
import java.util.Optional;

import com.rest.spring.Model.Student;

public interface Serviceinter {

    public List<Student> fetchAll();

    public Optional<Student> getStudentbyId(Integer studentId);

    public Student addStudent(Student student);

    public Student updaStudent(Student student);

    public void deleteStudent(Integer studentId);

}
