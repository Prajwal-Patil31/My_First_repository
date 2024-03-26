package com.blog.rest_blogapplication;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;


@SpringBootApplication
@EnableWebMvc
@Validated
public class RestBlogapplicationApplication {

	public static void main(String[] args) 
	{
	SpringApplication.run(RestBlogapplicationApplication.class, args);
	System.out.println("Hello world testing application started");
	}

	@Bean
	public ModelMapper modelMapper()
	{
		return new ModelMapper();
	}

}
