package com.standalone.thymleaf.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.standalone.thymleaf.Model.Student;
import com.standalone.thymleaf.Service.StudentServiceImpl;

import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;



@Controller
public class StudentController 
{
@Autowired    
StudentServiceImpl studentServiceImpl;

@RequestMapping(path = "/", method=RequestMethod.GET)
public String viewHomepage(Model model)
{
model.addAttribute("liststudents",studentServiceImpl.getAllStudents());
return "index";
}

@RequestMapping(path = "/newStudentForm", method=RequestMethod.GET)
public String showNewStudent(Model model)
{
Student student = new Student();
model.addAttribute("student", student);
return "NewStudent";
}

@RequestMapping(path = "/saveStudent", method=RequestMethod.POST)
public String saveStudent(@ModelAttribute("student") Student student)
{
    studentServiceImpl.addStudent(student);
    return "redirect:/";
}
@RequestMapping(path = "/showFormForUpdate/{id}", method=RequestMethod.GET)
public String showFormForUpdate(@PathVariable (value = "id") Integer id, Model model)
{
Student existingStudent =studentServiceImpl.getStudentId(id);
Student student = new Student();
if (student.getName() !=null && !student.getName().isEmpty())
{
existingStudent.setName(student.getName());    
}
if(student.getLastname() !=null && !student.getLastname().isEmpty())
{
 existingStudent.setLastname(student.getLastname());   
}
Student updatedStudent = studentServiceImpl.updateStudent(existingStudent);
model.addAttribute("existingStudent", existingStudent);
return "updatestudent";
}

@RequestMapping(path = "/deleteStudent/{id}", method=RequestMethod.GET)
public String deleteStudent(@PathVariable(value = "id") Integer id)
{
Student students=null;
students=studentServiceImpl.getStudentId(id);
studentServiceImpl.deleteStudentById(students);
return "redirect:/";
}
}
