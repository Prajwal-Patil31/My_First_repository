package com.practice.thymleaf_pract.Controllers.WebController;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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
}
