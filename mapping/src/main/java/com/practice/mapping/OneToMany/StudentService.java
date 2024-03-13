package com.practice.mapping.OneToMany;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {
    
@Autowired    
private StudentRepository studentRepository;

@Autowired
private LaptopRepository laptopRepository;

public int getMaxId()
{
    return studentRepository.findAll().size()+1;
}

public Student addStudent()
{
Student student= new Student();
Laptops laptops=new Laptops();
student.setStudentId(getMaxId());
student.setStudentName("RUT Patil");
student.setAbout("Employee");
student.setLaptop(laptops);
laptops.setModelNumber("1134");
laptops.setBrand("lenova");
laptops.setLaptopId(184);
laptops.setStudent(student);
studentRepository.save(student);
laptopRepository.save(laptops);
return student;

}



}
