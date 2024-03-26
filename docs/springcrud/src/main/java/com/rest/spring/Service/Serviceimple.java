package com.rest.spring.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rest.spring.Model.Student;
import com.rest.spring.Repository.StudentRepo;

@Service
public class Serviceimple implements Serviceinter {

    @Autowired
    private StudentRepo studentrepo;

    // List<Student> list;

    public Serviceimple() {
        // list = new ArrayList();
        // list.add(new Student(152, "Prajwal", "Patil", "prajwalmp31@gmail.com"));
        // list.add(new Student(158, "Tushar", "Patil", "benzuman45@gmail.com"));
    }

    @Override
    public List<Student> fetchAll() {
        // return list;
        return studentrepo.findAll();
    }

    @Override
    public Optional<Student> getStudentbyId(Integer studentId) {
        // Student s = null;
        // for (Student student : list) {
        // if (student.getId() == studentId) {
        // s = student;
        // break;
        // }
        // }
        // return s;
        return studentrepo.findById(studentId);
    }

    @Override
    public Student addStudent(Student student) {
        // list.add(student);
        // return student;
        studentrepo.save(student);
        return student;
    }

    @Override
    public Student updaStudent(Student student) {
        // for (Student update : list) {
        // if (update.getId() == studentup.getId()) {
        // update.setName(studentup.getName());
        // update.setLastname(studentup.getLastname());
        // update.setEmail(studentup.getEmail());
        // }
        // }
        // return studentup;
        Optional<Student> existingStudent = studentrepo.findById(student.getId());
        Student update;
        if (existingStudent.isPresent()) {
            Student existingStudentData = existingStudent.get();
            existingStudentData.setName(student.getName());
            existingStudentData.setEmail(student.getEmail());
            existingStudentData.setLastname(student.getLastname());
            update = studentrepo.save(existingStudentData);
        } else {
            update = new Student();
            update.setId(student.getId());
            update.setName(student.getName());
            update.setLastname(student.getLastname());
            update.setEmail(student.getEmail());
            update = studentrepo.save(update);
        }
        return update;

    }

    @Override
    public void deleteStudent(Integer studentId) {
        // List<Student> deleteStudent = new ArrayList<>();
        // for (Student delete : list) {
        // if (delete.getId() == deleteByid) {
        // deleteStudent.add(delete);
        // }
        // }
        // list.removeAll(deleteStudent);
        studentrepo.deleteById(studentId);
    }

}
