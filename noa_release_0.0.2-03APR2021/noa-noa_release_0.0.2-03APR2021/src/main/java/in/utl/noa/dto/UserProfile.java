package in.utl.noa.dto;

import in.utl.noa.model.Role;
import in.utl.noa.model.UserGroup;
import in.utl.noa.model.PasswordPolicy;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UserProfile {
	
	private Integer accountId;
    private String userName;
	private String password;
	private String firstName;
	private String middleInitial;
	private String lastName;
    private Role role;
    private PasswordPolicy policy;
	private String timeZone;
	private java.util.Date lastLoginTime;
	private List<UserGroup> groups;

    public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    public Role getRole() {
        return role;
    }

    public void setRole(final Role role) {
        this.role = role;
	}

	public Integer getAccountId() {
		return accountId;
	}

	public void setAccountId(Integer accountId) {
		this.accountId = accountId;
	}
	public String getUsername() {
		return userName;
	}

	public void setUsername(String userName) {
		this.userName = userName;
	}
	
	public List<UserGroup> getGroups() {
		return groups;
	}
		
	public void setGroups(List<UserGroup> groups) {
		this.groups = groups;
	}
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = PASSWORD_ENCODER.encode(password);
	}

	public String getFirstName() {
		return firstName;
	}
	
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getMiddleInitial() {
		return middleInitial;
	}

	public void setMiddleInitial(String middleInitial) {
		this.middleInitial = middleInitial;
	}

	public String getLastName() {
		return lastName;
	}
	
	public void setLastName(String lastName) {
		this.lastName = lastName;
    }
    
    public java.util.Date getLastLoginTime() {
		return lastLoginTime;
	}

	public void setLastLoginTime(java.util.Date lastLoginTime) {
		this.lastLoginTime = lastLoginTime;
    }
    
    public String getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
    }
    
    public PasswordPolicy getPolicy() {
		return policy;
	}
	
	public void setPolicy(PasswordPolicy policy) {
		this.policy = policy;
	}
}