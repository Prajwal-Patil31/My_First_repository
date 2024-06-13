package com.fullstack.fullstack.Controller;



import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
public class MyController 
{
    static Logger logger = LogManager.getLogger(MyController.class);
     
    @RequestMapping(value ="/about", method=RequestMethod.GET)
    public String about(Model model)
    {
    model.addAttribute("name","Prajwal Patil");
    model.addAttribute("currentDate", new Date().toLocaleString());
    logger.info("About method called");
     return "about";
    }

    /*Iterate handler*/
    /**
     * In frontend we need to iterate it with th:each
     */
    @RequestMapping(value = "/example-loop", method=RequestMethod.GET)
    public String iterateHandler(Model model)
    {
        List name = new ArrayList<>();
        name.add("Prajwal");
        name.add("Shashank");
        name.add("Tushar");
        
        model.addAttribute("list", name);
        logger.info("Iterate method called");
        return "iterate";
    }

    /**
     * @ModelAttribute is used to bring the object from frontend to backend 
     * Example public String processForm(@ModelAttribute("loginDate") LoginData loginData)
     */

}
