package com.springbackend.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springbackend.backend.Model.SpringModel;

public interface SpringRepo extends JpaRepository<SpringModel, Long> {

}
