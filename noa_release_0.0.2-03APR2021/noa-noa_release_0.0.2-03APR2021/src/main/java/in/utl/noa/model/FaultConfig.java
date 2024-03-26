package in.utl.noa.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.SequenceGenerator;

@Entity
@Table(name = "FAULT_CONFIG")
public class FaultConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "fault_config_fault_id_seq", initialValue = 1, allocationSize = 1)
    @Column(name = "FAULT_ID")
    private int faultId;
   
    @Column(name = "ERROR_CODE")
    private int faultErrorCode;

    @Column(name = "SEVERITY")
    private int severity;

    @Column(name = "RELATED_ERROR_CODE")
    private int relatedErrorCode;

    @Column(name = "TRAP_CATEGORY")
    private int trapCategory;

    public int getFaultId() {
        return faultId;
    }

    public void setAlamId(int faultId) {
        this.faultId = faultId;
    }

    public int getFaultErrorCode() {
        return faultErrorCode;
    }

    public void setAlamErrorCode(int alamErrorCode) {
        this.faultErrorCode = alamErrorCode;
    }

    public int getRelatedErrorCode() {
        return relatedErrorCode;
    }

    public void setRelatedErrorCode(int relatedErrorCode) {
        this.relatedErrorCode = relatedErrorCode;
    }

    public int getSeverity() {
        return severity;
    }

    public void setSeverity(int severity) {
        this.severity = severity;
    }

    public int getTrapCategory() {
        return trapCategory;
    }

    public void setTrapCategory(int trapCategory) {
        this.trapCategory = trapCategory;
    }
}