package in.utl.noa.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.OneToMany;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.FetchType;
import javax.persistence.SequenceGenerator;
import java.util.List;
import java.io.Serializable;

@Entity
@Table(name = "password_policy")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "policyId")
public class PasswordPolicy implements Serializable {

	private static final long serialVersionUID = 8223035087687631005L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "noa.password_policy_policy_id_seq", initialValue = 1, allocationSize = 1)
	@Column(name = "policy_id")
	public int policyId;

	@OneToMany(fetch = FetchType.EAGER, mappedBy="policy")
	/* @JsonBackReference */
	private List<UserAccount> accounts;

	@Column(name = "policy_name")
	private String policyName;

	@Column(name = "max_fail_attempt")
	private int maxFailAttempts;

	@Column(name = "passwd_exp_days")
	private int passExpDays;

	@Column(name = "min_len")
	private int minLength;
    
	@Column(name = "min_digits")
	private int minDigits;

	@Column(name = "min_spl_char")
	private int minSplChar;

	@Column(name = "min_uppr_char")
	private int minUpperChar;

	@Column(name = "min_low_char")
	private int minLowerChar;
	
	@Column(name = "num_multiple_login")
	private int numMultLogin;
	
	@Column(name = "num_old_passwd")
	private int numOldPass;

	@Column(name = "min_reuse_days")
	private int minReuseDays;

	public PasswordPolicy(final Integer policyId, String policyName) {
        super();
		this.policyId = policyId;
		this.policyName = policyName;
	}

	public PasswordPolicy() {

	}

    public int getPolicyId() {
		return policyId;
	}

	public void setPolicyId(int policyId) {
		this.policyId = policyId;
	}

	public String getpolicyName() {
		return policyName;
	}

	public void setPolicyName(String policyName) {
		this.policyName = policyName;
	}

	public int getmaxFailAttempts() {
		return maxFailAttempts;
	}

	public void setmaxFailAttempts(int maxFailAttempts) {
		this.maxFailAttempts = maxFailAttempts;
	}

	public int getpassExpDays() {
		return passExpDays;
	}

	public void setpassExpDays(int passExpDays) {
		this.passExpDays = passExpDays;
	}

	public int getminLength() {
		return minLength;
	}

	public void setminLength(int minLength) {
		this.minLength = minLength;
	}

	public int getminDigits() {
		return minDigits;
	}

	public void setminDigits(int minDigits) {
		this.minDigits = minDigits;
	}

	public int getminSplChar() {
		return minSplChar;
	}

	public void setminSplChar(int minSplChar) {
		this.minSplChar = minSplChar;
	}

	public void setminUpperChar(int minUpperChar) {
		this.minUpperChar = minUpperChar;
	}

	public int getminUpperChar() {
		return minUpperChar;
	}

	public void setminLowerChar(int minLowerChar) {
		this.minLowerChar = minLowerChar;
	}

	public int getminLowerChar() {
		return minLowerChar;
	}

	public void setnumMultLogin(int numMultLogin) {
		this.numMultLogin = numMultLogin;
	}

	public int getnumMultLogin() {
		return numMultLogin;
	}

	public void setnumOldPass(int numOldPass) {
		this.numOldPass = numOldPass;
	}

	public int getnumOldPass() {
		return numOldPass;
	}

	public void setminReuseDays(int minReuseDays) {
		this.minReuseDays = minReuseDays;
	}

	public int getminReuseDays() {
		return minReuseDays;
    }
}