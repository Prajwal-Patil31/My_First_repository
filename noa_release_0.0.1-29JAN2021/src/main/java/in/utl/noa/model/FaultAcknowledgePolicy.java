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


    /**
     *@return the policyId
    */
   public int getPolicyId() {
       return policyId;
   }

    /**
    *@param policyId the policyIdId to set
    */
    public void setPolicyId(int policyId) {
       this.policyId = policyId;
   }

    
    /* @return the policyName */
    
    public String getPolicyName() {
        return policyName;
    }

    /**
     * @param policyName the policyName to set
     */
    public void setPolicyName(String policyName) {
        this.policyName = policyName;
    }

    /**
     * @return the No Days Older
     */
    public int getDaysOlder() {
        return daysOlder;
    }

    /**
     * @param daysOlder the No Days Older
     */
    public void setDaysOlder(int daysOlder) {
        this.daysOlder = daysOlder;
    }
    
    /**
     * @return the severity
     */
    public String getSeverity() {
        return severity;
    }

    /**
     * @param severity the severity to set
     */
    public void setSeverity(String severity) {
        this.severity = severity;
    }

    /**
     * @return the hrsOlder
     */
    public int getHrsOlder() {
        return hrsOlder;
    }

    /**
     * @param hrsOlder the hrsOlder to set
     */
    public void setHrsOlder(int hrsOlder) {
        this.hrsOlder = hrsOlder;
    }

    /**
     * @return the RetainFault
     */
    public int getRetainFault() {
        return retainFault;
    }

    /**
     * @param retainFault the Retain Fault to set
     */
    public void setRetainFault(int retainFault) {
        this.retainFault = retainFault;
    }

}