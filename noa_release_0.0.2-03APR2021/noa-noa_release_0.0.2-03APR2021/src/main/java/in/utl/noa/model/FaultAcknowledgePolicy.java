package in.utl.noa.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.SequenceGenerator;

@Entity
@Table(name = "FAULT_ACK")
public class FaultAcknowledgePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "fault_ack_policy_id_seq", initialValue = 1, allocationSize = 1)
    @Column(name = "POLICY_ID")
    private int policyId;
    
    @Column(name = "SEVERITY")
    private String severity;

    @Column(name = "NO_OF_HRS_OLDER")
    private int hrsOlder;

    @Column(name = "NO_OF_DAYS_OLDER")
    private int daysOlder;

    @Column(name = "RETAIN_MIN_FAULTS")
    private int retainFault;

    @Column(name = "POLICY_NAME")
    private String policyName;

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

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public int getHrsOlder() {
        return hrsOlder;
    }

    public void setHrsOlder(int hrsOlder) {
        this.hrsOlder = hrsOlder;
    }

    public int getRetainFault() {
        return retainFault;
    }

    public void setRetainFault(int retainFault) {
        this.retainFault = retainFault;
    }
}