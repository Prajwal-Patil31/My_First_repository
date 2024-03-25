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

    /**
     * @return the No Of Days Older
     */
    public int getDaysOlder() {
        return daysOlder;
    }

    /**
     * @param daysOlder the No Of Days Older
     */
    public void setDaysOlder(int daysOlder) {
        this.daysOlder = daysOlder;
    }

    /**
     * @return the toSeverity
     */
    public String getToSeverity() {
        return toSeverity;
    }

    /**
     * @param toSeverity the severity to set
     */
    public void setToSeverity(String toSeverity) {
        this.toSeverity = toSeverity;
    }

    /**
     * @return the hrsOlder
     */
    public int getHrsOlder() {
        return hrsOlder;
    }

    /**
     * @param hrsOlder NO of Hrs Older
     */
    public void setHrsOlder(int hrsOlder) {
        this.hrsOlder = hrsOlder;
    }

    /**
     * @return the fromSeverity
     */
    public String getFromSeverity() {
        return fromSeverity;
    }

    /**
     * @param fromSeverity the severity to set
     */
    public void setFromSeverity(String fromSeverity) {
        this.fromSeverity = fromSeverity;
    } 

}