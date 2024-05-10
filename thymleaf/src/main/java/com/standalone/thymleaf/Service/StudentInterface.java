package com.standalone.thymleaf.Service;

import java.util.List;

import com.standalone.thymleaf.Model.Student;

public interface StudentInterface 
{
   
public List<Student> getAllStudents();

public Student addStudent(Student country);

public Student getStudentId(int id);

public Student getByStudentName(String studentname);

public Student updateStudent(Student student);

public void deleteStudentById(Student student);   
}
