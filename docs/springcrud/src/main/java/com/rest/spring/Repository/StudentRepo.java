package com.rest.spring.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rest.spring.Model.Student;

public interface StudentRepo extends JpaRepository<Student, Integer> {

}
