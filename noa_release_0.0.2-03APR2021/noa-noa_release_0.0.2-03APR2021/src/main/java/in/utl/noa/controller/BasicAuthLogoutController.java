package in.utl.noa.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.http.ResponseEntity;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.context.SecurityContextHolder;

import org.apache.log4j.Logger;

/* TODO : Overridden by Built-in logoutSuccessHandler() in  WebSecurityConfig()
Enhance this to do everything requried on Logout, including redirect */
@RestController
@RequestMapping(value = "/logout")
public class BasicAuthLogoutController {
    
    private static Logger logger = Logger.getLogger(BasicAuthLogoutController.class);

    public BasicAuthLogoutController() {
        super();
    }

    @GetMapping()
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session= request.getSession(false);
        SecurityContextHolder.clearContext();

        if(session != null) {
            session.invalidate();
        }

        for(Cookie cookie : request.getCookies()) {
            cookie.setMaxAge(0);
        }
        logger.info("BasicAuthLogoutController : logout() ");
        return ResponseEntity.noContent().build();
    }
}
