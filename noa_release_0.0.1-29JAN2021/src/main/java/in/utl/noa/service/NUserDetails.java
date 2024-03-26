package in.utl.noa.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import in.utl.noa.model.Feature;
import in.utl.noa.model.Role;
import in.utl.noa.model.UserAccount;
import in.utl.noa.model.UserAccountRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Component
public class NUserDetails implements UserDetailsService {

	private static Logger logger = Logger.getLogger(NUserDetails.class);
	private final UserAccountRepository accountRepo;
	public static final PasswordEncoder encoder = new BCryptPasswordEncoder();

	@Autowired
	public NUserDetails(UserAccountRepository repository) {
		this.accountRepo = repository;
	}

	@Override
	public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
		
		try {
			UserAccount userAccount = this.accountRepo.findByUserId(name);
			if (userAccount == null) {
				throw new UsernameNotFoundException("exception: User not found");
			} else {
				/* return new User(userAccount.getUserId(), userAccount.getPassword(), true, true, true, true,
						AuthorityUtils.createAuthorityList("ROLE_ADMIN")); */

				return new User(userAccount.getUserId(), userAccount.getPassword(), true, true, true, true, 
									getAuthorities(userAccount.getRole()));
			}
		} catch (final Exception e) {
			throw new RuntimeException(e);
		}
	}

	private final List<? extends GrantedAuthority> getAuthorities(final Role role) {
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
