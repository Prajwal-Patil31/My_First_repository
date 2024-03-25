package in.utl.noa.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.SequenceGenerator;

@Entity
@Table(name = "FAULT_ESC")
public class FaultEscalatePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "fault_esc_policy_id_seq", initialValue = 1, allocationSize = 1)
    @Column(name = "POLICY_ID")
    private int policyId;

    @Column(name = "POLICY_NAME")
    private String policyName;
    
    @Column(name = "TO_SEVERITY")
    private String toSeverity;

    @Column(name = "No_Of_hrs_Older")
    private int hrsOlder;

    @Column(name = "NO_OF_DAYS_OLDER")
    private int daysOlder;

    @Column(name = "FROM_SEVERITY")
    private String fromSeverity;

    public int getPolicyId() {
        return policyId;
    }

    public void setPolicyId(int policyId) {
        this.policyId = policyId;
    }

    public String getPolicyName() {
        return policyName;
    }

    public void setPolicyName(String policyName) {
        this.policyName = policyName;
    }

    public int getDaysOlder() {
        return daysOlder;
    }

    public void setDaysOlder(int daysOlder) {
        this.daysOlder = daysOlder;
    }

    public String getToSeverity() {
        return toSeverity;
    }

    public void setToSeverity(String toSeverity) {
        this.toSeverity = toSeverity;
    }

    public int getHrsOlder() {
        return hrsOlder;
    }

    public void setHrsOlder(int hrsOlder) {
        this.hrsOlder = hrsOlder;
    }

    public String getFromSeverity() {
        return fromSeverity;
    }

    public void setFromSeverity(String fromSeverity) {
        this.fromSeverity = fromSeverity;
    } 
}