package in.utl.noa.controller;

import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

@Controller
public class RouteController {
    private static Logger logger = Logger.getLogger(RouteController.class);

    /* @RequestMapping({ "/network/{regex:\\w+}", "/inventory/{regex:\\w+}", "/faults/{regex:\\w+}",
            "/performance/{regex:\\w+}", "/diagnostics/{regex:\\w+}", "/security/{regex:\\w+}" }) */
    @RequestMapping(value = {"/{path:^(?!api|lib).*}/{path:[^\\.]*}/**"}, method = RequestMethod.GET)
    public String index(final HttpServletRequest request) {
        final String url = request.getRequestURI();

        return "forward:/";
    }

}