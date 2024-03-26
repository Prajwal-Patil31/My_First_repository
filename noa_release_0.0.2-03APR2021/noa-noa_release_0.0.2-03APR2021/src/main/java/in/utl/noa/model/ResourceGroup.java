package in.utl.noa.model;

import javax.persistence.Entity;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.ManyToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.GenerationType;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import java.util.List;
import java.io.Serializable;

@Entity
@Table(name = "resource_group")
public class ResourceGroup implements Serializable {

    private static final long serialVersionUID = 243769922833074770L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "noa.resource_group_resource_group_id_seq", initialValue = 1, allocationSize = 1)
    @Column(name="resource_group_id")
    private int resourceGroupId;

    @Column(name="resource_group_code")
    private String resourceGroupCode;

    @Column(name="resource_group_name")
    private String resourceGroupName;

    @Column(name="resource_group_type")
    private String resourceGroupType;

    @LazyCollection(LazyCollectionOption.FALSE)
    @ManyToMany() 
    @JoinTable(
		name = "resourcegroup_resource", 
    	joinColumns ={ @JoinColumn(name = "resource_group_id", referencedColumnName = "resource_group_id") },
		inverseJoinColumns = { @JoinColumn(name = "resource_id", referencedColumnName = "resource_id") }
	)
    private List<Resource> resources;

    public int getResourceGroupId() {
        return resourceGroupId;
    }

    public void setResourceGroupId(int resourceGroupId) {
        this.resourceGroupId = resourceGroupId;
    }

    public String getResourceGroupCode() {
        return resourceGroupCode;
    }

    public void setResourceGroupCode(String resourceGroupCode) {
        this.resourceGroupCode = resourceGroupCode;
    }

    public String getResourceGroupName() {
        return resourceGroupName;
    }

    public void setResourceGroupName(String resourceGroupName) {
        this.resourceGroupName = resourceGroupName;
    }

    public String getResourceGroupType() {
        return resourceGroupType;
    }

    public void setResourceGroupType(String resourceGroupType) {
        this.resourceGroupType = resourceGroupType;
    }

    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(final List<Resource> resources) {
        this.resources = resources;
    }

    public ResourceGroup() {
    }
}

    

