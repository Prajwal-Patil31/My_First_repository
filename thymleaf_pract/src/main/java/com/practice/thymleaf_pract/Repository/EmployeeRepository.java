package com.practice.thymleaf_pract.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practice.thymleaf_pract.Model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository <Employee,Integer>
{
    
}
