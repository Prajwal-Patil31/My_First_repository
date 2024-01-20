package com.practice.mapping.OneToMany;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class MainApplication 
{
     
@Autowired
private StudentRepository studentRepository;    

   
public Student sToringStudent()
{
    Student student = new Student();
    student.setStudentId(1);
    student.setStudentName("Prajwal Patil");
    student.setAbout("Employee");
    studentRepository.save(student);
    return student;
}

}


