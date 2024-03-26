package in.utl.noa.security.authorization;

import in.utl.noa.model.UserAccount;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import javax.servlet.http.HttpServletRequest;
import org.apache.log4j.Logger;

import java.util.List;
import java.util.Collection;

@Service("WebSecurityService")
public class WebSecurityService {
    private static Logger logger = Logger.getLogger(WebSecurityService.class);
    String qryUri = "SELECT FEATURE_ID FROM URI_FEATURE WHERE URI_PATH = ?";
    String qryFeature = "SELECT FEATURE_NAME FROM FEATURE_INFO WHERE FEATURE_ID = ?";

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean check(Authentication auth, HttpServletRequest req) {
        /* UserAccount user = (UserAccount)auth.getPrincipal(); */
        Collection<? extends GrantedAuthority> access = auth.getAuthorities();
        String reqUri = req.getRequestURI();
        String[] pathSegs = reqUri.split("/");
        String privilege = "";
        String uri = "";
        
        uri = pathSegs.length > 2 ? pathSegs[2] : pathSegs[1];

        if(uri.equals("api"))
            return true;

        if (uri != "") {
            int featureId = jdbcTemplate.queryForObject(qryUri, new Object[] { uri }, Integer.class);
            privilege = jdbcTemplate.queryForObject(qryFeature, new Object[] { featureId }, String.class);
        }

        if (privilege != "") {
            GrantedAuthority gam = new SimpleGrantedAuthority(privilege);
            GrantedAuthority gav = new SimpleGrantedAuthority(privilege + "ViewOnly");
            boolean voaccess = access.contains(gav);

            if (access.contains(gam) || voaccess) {
                if (voaccess && (req.getMethod() != "GET")) {
                    return false;
                }
                return true;
            }
        }
        
        return false;
    }
}