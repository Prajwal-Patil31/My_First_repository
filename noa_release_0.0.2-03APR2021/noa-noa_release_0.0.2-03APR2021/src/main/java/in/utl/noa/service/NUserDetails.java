package in.utl.noa.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import in.utl.noa.model.Feature;
import in.utl.noa.model.Role;
import in.utl.noa.model.UserAccount;
import in.utl.noa.model.UserAccountRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.apache.log4j.Logger;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service("NUserDetails")
public class NUserDetails implements UserDetailsService {

	private static Logger logger = Logger.getLogger(NUserDetails.class);
	public static final PasswordEncoder encoder = new BCryptPasswordEncoder();

	@Autowired
	private UserAccountRepository accountRepo;

	@Override
	public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
		
		try {
			UserAccount userAccount = this.accountRepo.findByUserName(name);
			if (userAccount == null) {
				throw new UsernameNotFoundException("exception: User not found");
			} else {
				/* return new User(userAccount.getUserId(), userAccount.getPassword(), true, true, true, true,
						AuthorityUtils.createAuthorityList("ROLE_ADMIN"));
				return new User(userAccount.getUsername(), userAccount.getPassword(), true, true, true, true, 
									getAuthorities(userAccount.getRole())); */
				userAccount.setAuthorities(getAuthorities(userAccount.getRole()));
				return userAccount;
			}
		} catch (final Exception e) {
			throw new RuntimeException(e);
		}
	}

	private final List<GrantedAuthority> getAuthorities(final Role role) {
        return getGrantedAuthorities(getFeatures(role));
    }

    private final List<String> getFeatures(final Role role) {
        final List<String> features = new ArrayList<String>();
		final List<Feature> collection = new ArrayList<Feature>();
		
        collection.addAll(role.getFeatures());
		
        for (final Feature item : collection) {
            features.add(item.getFeatureName());
		}		
        return features;
    }

    private final List<GrantedAuthority> getGrantedAuthorities(final List<String> features) {
		final List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
		
        for (final String feature : features) {
            authorities.add(new SimpleGrantedAuthority(feature));
		}
        return authorities;
    }
}
