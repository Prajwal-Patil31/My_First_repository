package com.noa.noa_practice;

import org.apache.logging.log4j.LogManager;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.apache.logging.log4j.Logger;
@SpringBootApplication
public class NoaPracticeApplication {
static Logger logger = LogManager.getLogger(NoaPracticeApplication.class); 
	public static void main(String[] args) 
	{
		SpringApplication.run(NoaPracticeApplication.class, args);
		logger.info("Application Started");
	}

}
