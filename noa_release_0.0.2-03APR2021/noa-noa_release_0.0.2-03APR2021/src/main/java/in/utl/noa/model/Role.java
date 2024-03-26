package in.utl.noa.model;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.FetchType;
import javax.persistence.SequenceGenerator;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "role")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "roleId")
public class Role implements Serializable {

	private static final long serialVersionUID = 2166767574384150667L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "noa.role_role_id_seq", initialValue = 1, allocationSize = 1)
	@Column(name = "role_id")
	private int roleId;

	@LazyCollection(LazyCollectionOption.FALSE)
    @ManyToMany() 
    @JoinTable(
		name = "role_feature", 
    	joinColumns ={ @JoinColumn(name = "role_id", referencedColumnName = "role_id") },
		inverseJoinColumns = { @JoinColumn(name = "feature_id", referencedColumnName = "feature_id") }
	)
	/* @JsonManagedReference */
    private List<Feature> features;

	@OneToMany (fetch = FetchType.EAGER, mappedBy = "role")	
	/* @JsonBackReference */
	private List<UserAccount> accounts;

	@Column(name = "role_code")
	private String roleCode;

	@Column(name = "role_name")
	private String roleName;
    
    @Column(name = "service_id")
    private int serviceID;
    
    @Column(name = "last_update_id")
    private String lastUpdateId;

    @Column(name = "last_update_timestamp")
    private LocalDateTime lastUpdateTimeStamp;

	public Role() {
        super();
    }

    public Role(final String name) {
        super();
        this.roleName = name;
	}
	
	public int getRoleId() {
		return roleId;
	}

	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}

	public String getRoleCode() {
		return roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}

	public List<Feature> getFeatures() {
        return features;
    }

    public void setFeatures(final List<Feature> features) {
        this.features = features;
	}
	
	public List<UserAccount> getAccounts() {
        return accounts;
    }

    public void setAccounts(final List<UserAccount> accounts) {
        this.accounts = accounts;
	}
    
	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public int getServiceID() {
		return serviceID;
	}

	public void setServiceID(int serviceID) {
		this.serviceID = serviceID;
    }

	public String getLastUpdateId() {
		return lastUpdateId;
	}

	public void setLastUpdateId(String lastUpdateId) {
		this.lastUpdateId = lastUpdateId;
    }

	public LocalDateTime getLastUpdateTimeStamp() {
		return lastUpdateTimeStamp;
	}

	public void setLastUpdateTimeStamp(LocalDateTime lastUpdateTimeStamp) {
		this.lastUpdateTimeStamp = lastUpdateTimeStamp;
    }
}
