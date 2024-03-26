package in.utl.noa.model;

import javax.persistence.Entity;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.GenerationType;
import javax.persistence.FetchType;
import javax.persistence.SequenceGenerator;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.Transient;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.io.Serializable;
import org.apache.log4j.Logger;

@Entity
@Table(name = "user_account")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "accountId")
public class UserAccount implements UserDetails, Serializable {

	private static final long serialVersionUID = 243769922833074770L;
	private static Logger logger = Logger.getLogger(UserAccount.class);

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "noa.user_account_account_id_seq", initialValue = 1, allocationSize = 1)
	@Column(name = "account_id")
	private int accountId;

	public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

	@ManyToOne(fetch = FetchType.EAGER) 
    @JoinTable(
		name = "user_role", 
    	joinColumns ={ @JoinColumn(name = "account_id", referencedColumnName = "account_id") },
		inverseJoinColumns = { @JoinColumn(name = "role_id", referencedColumnName = "role_id") }
	)
	/* @JsonManagedReference */
	private Role role;

	@ManyToMany (fetch = FetchType.EAGER, mappedBy = "accounts")
	@JsonBackReference
    private List<UserGroup> groups;

	@Column(name = "user_name")
	private String userName;

	@Column(name = "password")
	private String password;

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "middle_initial")
	private String middleInitial;

	@Column(name = "last_name")
	private String lastName;

	@Column(name = "activation_date")
	private java.util.Date activationDate;

	@Column(name = "expiration_date")
	private java.util.Date expiryDate;

	@Column(name = "preferred_lang_code")
	private String prefLangCode;
	
	@Column(name = "pwd_question")
	private String pwdQuestion;

	@Column(name = "pwd_answer")
	private String pwdAnswer;

	@Column(name = "time_zone")
	private String timeZone;

	@Column(name = "status")
	private boolean acStatus;

	@Column(name = "auth_type")
	private double authType;

	@Column(name = "failed_attempts")
	private double failedAttempts;

	@Column(name = "last_login_timestamp")
	private java.util.Date lastLoginTime;

	@Column(name = "num_current_sessions")
	private double noCurSessions;

	@ManyToOne(fetch = FetchType.EAGER)
	@NotFound(action = NotFoundAction.IGNORE)
	@JoinColumn(name = "policy_id", nullable = true)
	/* @JsonManagedReference */
	private PasswordPolicy policy;

	@Column(name = "last_update_id")
	private String lastUpdatedId;

	@Column(name = "last_update_timestamp")
	private java.util.Date lastUpdateTime;
	
	@Column(name = "options_flag")
	private int optionsFlag;

	@Column(name = "locked_timestamp")
	private int lockedTime;

	@Column(name = "email")
	private String email;

	@Column(name = "mobile_number")
	private String mobileNo;

	@Transient
	private List<GrantedAuthority> authorities;

	protected UserAccount() {
	}

	public UserAccount(String username, String password) {
		this.userName = username;
		this.password = password;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		UserAccount userAcc = (UserAccount) o;
		return Objects.equals(userName, userAcc.userName) && Objects.equals(password, userAcc.password);
	}

	public List<UserGroup> getGroups() {
        return groups;
    }

    public void setGroups(final List<UserGroup> groups) {
        this.groups = groups;
	}
	
	public Integer getAccountId() {
		return accountId;
	}

	public void setAccountId(Integer accountId) {
		this.accountId = accountId;
	}

	public Role getRole() {
        return role;
    }

    public void setRole(final Role role) {
        this.role = role;
	}

	@Override
	public String getUsername() {
		return userName;
	}

	public void setUsername(String username) {
		this.userName = username;
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

	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
    }
    
    public String getMobileNo() {
		return mobileNo;
	}
	
	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
    }

	public java.util.Date getActivationDate() {
		return activationDate;
	}

	public void setActivationDate(java.util.Date activationDate) {
		this.activationDate = activationDate;
	}
	
	public java.util.Date getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(java.util.Date expiryDate) {
		this.expiryDate = expiryDate;
	}

	public String getPrefLangCode() {
		return prefLangCode;
	}

	public void setPrefLangCode(String prefLangCode) {
		this.prefLangCode = prefLangCode;
	}

	public String getPwdQuestion() {
		return pwdQuestion;
	}
	
	public void setPwdQuestion(String pwdQuestion) {
		this.pwdQuestion = pwdQuestion;
	}
	
	public String getPwdAnswer() {
		return pwdAnswer;
	}
	
	public void setPwdAnswer(String pwdAnswer) {
		this.pwdAnswer = pwdAnswer;
	}

	public String getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
	}

	public boolean getAcStatus() {
		return acStatus;
	}

	public void setAcStatus(boolean acStatus) {
		this.acStatus = acStatus;
	}

	public double getAuthType() {
		return authType;
	}

	public void setAuthType(double authType) {
		this.authType = authType;
	}

	public double getFailedAttempts() {
		return failedAttempts;
	}
	
	public void setFailedAttempts(double failedAttempts) {
		this.failedAttempts = failedAttempts;
	}

	public java.util.Date getLastLoginTime() {
		return lastLoginTime;
	}

	public void setLastLoginTime(java.util.Date lastLoginTime) {
		this.lastLoginTime = lastLoginTime;
	}

	public double getNoCurSessions() {
		return noCurSessions;
	}
	
	public void setNoCurSessions(double noCurSessions) {
		this.noCurSessions = noCurSessions;
	}

	public PasswordPolicy getPolicyId() {
		return policy;
	}
	
	public void setPolicyId(PasswordPolicy policy) {
		this.policy = policy;
	}

	public String getLastUpdatedId() {
		return lastUpdatedId;
	}
	
	public void setLastUpdatedId(String lastUpdatedId) {
		this.lastUpdatedId = lastUpdatedId;
	}

	public java.util.Date getLastUpdateTime() {
		return lastUpdateTime;
	}

	public void setLastUpdateTime(java.util.Date lastUpdateTime) {
		this.lastUpdateTime = lastUpdateTime;
	}

	public int getOptionsFlag() {
		return optionsFlag;
	}
	
	public void setOptionsFlag(int optionsFlag) {
		this.optionsFlag = optionsFlag;
	}

	public int getLockedTime() {
		return lockedTime;
	}
	
	public void setLockedTime(int lockedTime) {
		this.lockedTime = lockedTime;
	}

	@Override
	public int hashCode() {
		int result = Objects.hash(userName, password, role);
		return result;
	}

	@Override
	public String toString() {
		final StringBuilder builder = new StringBuilder();
		builder.append("User [id=").append(accountId).append(", userName=").append(userName).append("]");
        return builder.toString();
	}

	@Override
	public List<GrantedAuthority> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(List<GrantedAuthority> authorities) {
		this.authorities = authorities;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return acStatus;
	}
}
