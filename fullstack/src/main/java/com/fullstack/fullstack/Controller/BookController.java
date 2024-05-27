package com.fullstack.fullstack.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Controller for handeling requests related to books.
 */

@Controller
@RequestMapping("/books")
public class BookController
{
    static Logger logger = LogManager.getLogger(BookController.class);
    
    /**
     * Handel get requests to the /books endpoint 
     * <p>
     * Here i am using the request param, it is used to bring the information form the 
     * frontend to backend, data will be binded in the variable 'login' and 'email'. 
     * By using required=false we can specify that the user can enter the data into the form is optional,
     * by using model attribute we can insert data into frontend or fetch the data. 
     * </p>
     * @param login The user's login information, which is optional.
     * @param email email user's email information which is also optional.
     * @param model model The model to which attributes can be added.
     * @return The name of the view to be rendered, "book_page"
     */
    @GetMapping 
    public String getBookPage(@RequestParam(required = false, name = "login")String login, @RequestParam(required = false) String email, Model model)
    {
        logger.info("User login is "+login);
        model.addAttribute("userLogin",login);
        return "book_page";
    }
}
