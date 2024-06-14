package com.practice.thymleaf_pract.Controllers.WebController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Arrays;

import com.practice.thymleaf_pract.Model.Employee;


@Controller
public class ThymleafController 
{
    @RequestMapping(path = "/", method=RequestMethod.GET)
    public String handleHome(Model model)
    {
        Employee emp = new Employee();
        emp.setId(1);
        emp.setName("Prajwal Patil");
        emp.setMob("95351656798");

        model.addAttribute("myEmp", emp);
        return "index";
    }
    
    @ResponseBody
    @RequestMapping(path = "/emp/{eid}", method=RequestMethod.GET)
    public String getEmployeeId(@PathVariable("eid") Integer id)
    {
        return " Your Employee : "+id;
    }

    @RequestMapping(path = "/contact", method=RequestMethod.GET)    
    public String handleContact(Model model)
    {
        model.addAttribute("idEmp", 210);
        return"contact";
    }
    
    @ResponseBody
    @RequestMapping(path = "/emp", method=RequestMethod.GET)
    public String queryhandler(@RequestParam("idE") Integer id)
    {
       return " Your Employee 3 : "+id;
    }
    
   @RequestMapping(path = "/msg", method=RequestMethod.GET)
   public String msgVariable()    
   {
    return "message";
   }
  
   @RequestMapping(path = "/conditional", method=RequestMethod.GET)   
   public String handleConditional(Model model)
   {
    Employee empNew = new Employee();
    empNew.setId(1);
    empNew.setName("Tushar Patil");
    empNew.setMob("7022288098");
    empNew.setSalary(25000.05);
    model.addAttribute("empSal", empNew);
     return "conditional";
   }
   
   @RequestMapping(path = "/switch", method=RequestMethod.GET)
   public String switchStatement(Model model)
   {
    Employee emp1 = new Employee();
    emp1.setId(2);
    emp1.setName("Suraj");
    emp1.setMob("6362629419");
    emp1.setSalary(21000.03);
    model.addAttribute("empShas", emp1);
    return "switch";
   }
  
   @RequestMapping(path = "/looping", method = RequestMethod.GET)
   public String handleLooping(Model model) {
    List<Employee> empList = Arrays.asList(
        new Employee(1, "Prajwal", "9535165678"),
        new Employee(2, "Tushar", "7022288098")

    );
    model.addAttribute("empList", empList);
    return "looping";
}
/**
 * Here to take the frontend data to backend we need to add 'Model' in argument 
 * then in model.addAttribute we should send one string, that string 
 * should be called in th:object="${}" in frontend form.
 * 
 * @param model
 * @return
 */
   @RequestMapping(path = "/registration", method=RequestMethod.GET)
   public String registrationHandler(Model model) {
    model.addAttribute("empObject", new Employee());
       return "registration";
   }
   
   /**
    * Then to bring the frontend data to backend we need to add @ModelAttribute in that we need to call that th:object="${}" 
      and we need to pass entity class in argument then that frontend data will be bindad in this object.
    * @param emp
    * @return
    */
   @RequestMapping(path = "/saveEmp", method=RequestMethod.POST)
   public String postRequest(@ModelAttribute("empObject") Employee emp)
   {
    System.out.println(emp);
    return "redirect:/";
   }
   
}
