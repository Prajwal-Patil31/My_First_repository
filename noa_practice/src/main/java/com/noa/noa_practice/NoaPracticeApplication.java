package com.noa.noa_practice;

import org.apache.logging.log4j.LogManager;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.apache.logging.log4j.Logger;

/**
 * This class represents the main entry point for the Noa Practice Application.
 */
@SpringBootApplication
public class NoaPracticeApplication {

    // Logger instance for logging messages
    static Logger logger = LogManager.getLogger(NoaPracticeApplication.class); 

    /**
     * The main method to start the application.
     * 
     * @param args Command-line arguments passed to the application.
     */
    public static void main(String[] args) {
        SpringApplication.run(NoaPracticeApplication.class, args);
        logger.info("Application Started");
    }
}
