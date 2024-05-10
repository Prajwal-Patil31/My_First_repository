package com.standalone.thymleaf.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.standalone.thymleaf.Model.Student;
import com.standalone.thymleaf.Repository.StudentRepository;

@Service
public class StudentServiceImpl implements StudentInterface
{
@Autowired
StudentRepository studentRepository;

    @Override
    public List<Student> getAllStudents() 
    {
        return studentRepository.findAll();
    }
    
    public int getMaxId()
  {
      return studentRepository.findAll().size()+1;
  }
  
      @Override 
      public Student addStudent(Student student) {
        student.setId(getMaxId());
          studentRepository.save(student);
          return student;
      }

      @Override
      public Student getStudentId(int id) {
      List<Student> students = studentRepository.findAll();
      Student student=null;
      for (Student c: students)
      {
      if(c.getId()==id)
      {
        student =c;
      }
      }   
      return student;
      }

      @Override 
      //@Cacheable(value = "countries", key = "#countryName")
      public Student getByStudentName(String studentname) {
        List<Student> students = studentRepository.findAll();
        Student student =null;
        for(Student c: students)
        {
          if(c.getName().equalsIgnoreCase(studentname))
          {
            student=c;
          }
        }
        return student;
      }

      @Override
      //@Cacheable(value = "countries" ,key = "#country.id")
      public Student updateStudent(Student student) {
        studentRepository.save(student);
        return student;
      }

      @Override
      //@CacheEvict(value = "countries", key="#id")
      public void deleteStudentById(Student student) {
        studentRepository.delete(student);   
      }
      
}
