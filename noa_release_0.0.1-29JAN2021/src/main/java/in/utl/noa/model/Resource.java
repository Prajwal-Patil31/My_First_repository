package in.utl.noa.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.GenerationType;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "resource")
public class Resource implements Serializable {
    private static final long serialVersionUID = 243769922833074770L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "noa.resource_resource_id_seq", initialValue = 1, allocationSize = 1)
    @Column(name="resource_id")
    private int resourceId;

    @Column(name="resource_name")
    private String resourceName;

    @ManyToMany (fetch = FetchType.EAGER, mappedBy = "resources")
	@JsonBackReference
    private List<ResourceGroup> resGroups;

    public int getResourceId() {
        return resourceId;
    }

    public void setResourceId(int resourceId) {
        this.resourceId = resourceId;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public List<ResourceGroup> getGroups() {
        return resGroups;
    }

    public void setGroups(final List<ResourceGroup> resGroups) {
        this.resGroups = resGroups;
	}
    public Resource() {

    }
}
