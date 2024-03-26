package in.utl.noa.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ManyToMany;
import javax.persistence.FetchType;
import javax.persistence.SequenceGenerator;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "feature_info")
public class Feature implements Serializable {

	private static final long serialVersionUID = 1536274363310868352L;
	
    @Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ")
	@SequenceGenerator(name = "SEQ", sequenceName = "noa.feature_info_feature_id_seq", initialValue = 1, allocationSize = 1)
	@Column(name = "feature_id")
    private int featureId;

	@ManyToMany (fetch = FetchType.EAGER, mappedBy = "features")
	@JsonBackReference
    private List<Role> roles;

    @Column(name = "feature_name")
	private  String  featureName;

	@Column(name = "subsystem_id")
	private String subSystemId;

	@Column(name = "service_id")
    private int serviceId;
  
	public Feature() {
        super();
    }

    public Feature(final String name) {
        super();
        this.featureName = name;
	}
	
	public int getFeatureId() {
		return featureId;
	}

	public void setFeatureId(int featureId) {
		this.featureId = featureId;
    }
	
	public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(final List<Role> roles) {
        this.roles = roles;
	}
	
	public String getFeatureName() {
		return featureName;
	}

	public void setFeatureName(String featureName) {
		this.featureName = featureName;
    }
    
	public String getSubSystemId() {
		return subSystemId;
	}

	public void setSubSystemId(String subSystemId) {
		this.subSystemId = subSystemId;
    }

	public int getServiceId() {
		return serviceId;
	}

	public void setServiceId(int serviceId) {
		this.serviceId = serviceId;
	}
}