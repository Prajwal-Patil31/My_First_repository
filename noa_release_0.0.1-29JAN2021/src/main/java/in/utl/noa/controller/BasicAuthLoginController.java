package in.utl.noa.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONObject;

import in.utl.noa.model.UserAccount;
import in.utl.noa.model.UserAccountRepository;

@RestController
@RequestMapping(value = "/login", produces = "application/json")
public class BasicAuthLoginController {
    
    private static Logger logger = Logger.getLogger(BasicAuthLoginController.class);

    @Autowired
    private UserAccountRepository userRepository;

    public BasicAuthLoginController() {
        super();
    }

    @GetMapping()
    public ResponseEntity<String> login(final Authentication auth) {
        UserAccount userac = (UserAccount) auth.getPrincipal();
        String username = userac.getUserId();
        Integer accId = userac.getAccountId();
        UserAccount profile = userRepository.findByAccountId(accId);
        String fname = profile.getFirstName();
        String lname = profile.getLastName();

        JSONObject resp = new JSONObject();
        resp.put("FirstName",fname);
        resp.put("LastName",lname);
        resp.put("UserName",username);

        return new ResponseEntity<String>(resp.toString(), HttpStatus.OK);
    }
}
