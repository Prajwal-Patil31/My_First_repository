package com.standalone.thymleaf.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.standalone.thymleaf.Model.Student;

@Repository
public interface StudentRepository extends JpaRepository <Student,Integer>
{

}
