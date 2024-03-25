package in.utl.noa.model;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ManyToMany;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.SequenceGenerator;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "user_group")
public class UserGroup implements Serializable{
    
    private static final long serialVersionUID = 243769922833074770L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "noa.user_group_group_id_seq", initialValue = 1, allocationSize = 1)
    @Column(name = "group_id")
    private int groupId;

    @LazyCollection(LazyCollectionOption.FALSE)
    @ManyToMany() 
    @JoinTable(
		name = "usergroup_user", 
    	joinColumns ={ @JoinColumn(name = "group_id", referencedColumnName = "group_id") },
		inverseJoinColumns = { @JoinColumn(name = "account_id", referencedColumnName = "account_id") }
	)
    private List<UserAccount> accounts;

    @Column(name="group_name")
    public String groupName;

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }
    
    public List<UserAccount> getAccounts() {
        return accounts;
    }

    public void setAccounts(final List<UserAccount> accounts) {
        this.accounts = accounts;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }
    
    public UserGroup() {
    }
}
