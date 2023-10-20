package com.rest.spring;

import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ApplicationTests {

	@Test
	void contextLoads() {
	}


	@Test
	@Order(4)
	public void test_delete(){
		 Student student =new Student(2,"abcd","pm@.com");
		 studentService.deleteStudent(student);
		 verify(studentRepo,times(1)).delete(student);
	}
}
