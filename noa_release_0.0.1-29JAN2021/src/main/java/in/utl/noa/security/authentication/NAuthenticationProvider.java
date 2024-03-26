package in.utl.noa.security.authentication;

import in.utl.noa.model.UserAccountRepository;
import in.utl.noa.model.UserAccount;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.apache.log4j.Logger;

public class NAuthenticationProvider extends DaoAuthenticationProvider {

    private static Logger logger = Logger.getLogger(NAuthenticationProvider.class);

    @Autowired
    private UserAccountRepository userRepository;

    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {
        final UserAccount user = userRepository.findByUserId(auth.getName());
    
        if ((user == null)) {
            throw new BadCredentialsException("Invalid username or password");
        }
        
        final Authentication result = super.authenticate(auth);
        return new UsernamePasswordAuthenticationToken(user, result.getCredentials(), result.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
