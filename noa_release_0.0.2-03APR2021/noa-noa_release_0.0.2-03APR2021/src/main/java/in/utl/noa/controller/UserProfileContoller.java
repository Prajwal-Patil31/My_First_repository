package in.utl.noa.controller;

import in.utl.noa.model.UserAccountRepository;
import in.utl.noa.model.UserAccount;
import in.utl.noa.dto.UserProfile;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.apache.log4j.Logger;

import org.modelmapper.ModelMapper;

@RestController
@RequestMapping(value = "/api/profile")
public class UserProfileContoller {
    
    private static Logger logger = Logger.getLogger(UserProfileContoller.class);

    @Autowired
    private UserAccountRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public UserProfileContoller() {
        super();
    }

    @GetMapping()
    public ResponseEntity<UserProfile> getProfile(final Authentication auth) {
        UserAccount userac = (UserAccount) auth.getPrincipal();
        String username = userac.getUsername();
        UserProfile profile = modelMapper.map(userac, UserProfile.class);
        
        return ResponseEntity.ok(profile);
    }

    @PatchMapping()
    public ResponseEntity<UserProfile> updateProfile(@RequestBody UserProfile profile) {
        String fname = profile.getFirstName();
        String lname = profile.getLastName();
        Integer accountId = profile.getAccountId();
        UserAccount userac = userRepository.findByAccountId(accountId);
        if(userac != null) {
            userac.setFirstName(fname);
            userac.setLastName(lname);
        }
        return ResponseEntity.ok(profile);
    }
}