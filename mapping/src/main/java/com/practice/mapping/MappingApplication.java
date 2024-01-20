package com.practice.mapping;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

import com.practice.mapping.OneToMany.Student;


@SpringBootApplication
@ComponentScan("com.practice.mapping.OneToMany")
public class MappingApplication 
{

	public static void main(String[] args) 
	{
		SpringApplication.run(MappingApplication.class, args);
		System.out.println("Hello java");

	}

}
