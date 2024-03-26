package in.utl.noa.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.SequenceGenerator;

@Entity
@Table(name = "FAULTS")
public class Fault {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "faults_fault_id_seq", initialValue = 1, allocationSize = 1)
    @Column(name = "FAULT_ID")
    private int faultId;

    @Column(name = "FAULT_DATE")
    private java.util.Date faultDate;

    @Column(name = "COUNT")
    private int count;
   
    @Column(name = "ERROR_CODE")
    private int faultErrorCode;

    @Column(name = "RELATED_FAULT_ID")
    private int relatedFaultId;

    @Column(name = "SEVERITY")
    private int severity;
  
    @Column(name = "STATUS_CODE")
    private int statusCode;

    @Column(name = "FAULT_CONTENT")
    private String faultContent;

    @Column(name = "FAULT_SYSTEM_ID")
    private String faultSysId;

    @Column(name = "CLR_USERNAME")
    private String clearUsername;

    @Column(name = "CLR_DATE")
    private java.util.Date clearDate;

    @Column(name = "ACK_USERNAME")
    private String ackUsername;

    @Column(name = "ACK_DATE")
    private java.util.Date ackDate;

    @Column(name = "FAULT_HOSTNAME")
    private String hostname;

    @Column(name = "SITE_ID")
    private int siteId;

    public int getFaultId() {
        return faultId;
    }

    public void setFaultId(final int faultId) {
        this.faultId = faultId;
    }

    public java.util.Date getFaultDate() {
        return faultDate;
    }

    public void setFaultDate(java.util.Date faultDate) {
        this.faultDate = faultDate;
    }

    public int getSeverity() {
        return severity;
    }

    public void setSeverity(final int severity) {
        this.severity = severity;
    }

    public int getFaultErrorCode() {
        return faultErrorCode;
    }

    public void setFaultErrorCode(final int faultErrorCode) {
        this.faultErrorCode = faultErrorCode;
    }

    public int getRelatedFaultId() {
        return relatedFaultId;
    }

    public void setRelatedFaultId(int relatedFaultId) {
        this.relatedFaultId = relatedFaultId;
    }

    public String getFaultSysId() {
        return faultSysId;
    }

    public void setFaultSysId(String faultSysId) {
        this.faultSysId = faultSysId;
    }

    public String getHost() {
        return hostname;
    }

    public void setHost(final String hostname) {
        this.hostname = hostname;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(final int statusCode) {
        this.statusCode = statusCode;
    }

    public String getFaultContent() {
        return faultContent;
    }

    public void setFaultContent(final String faultContent) {
        this.faultContent = faultContent;
    }

    public String getClearUsername() {
        return clearUsername;
    }

    public void setClearUsername(final String clearUsername) {
        this.clearUsername = clearUsername;
    }

    public java.util.Date getClearDate() {
        return clearDate;
    }

    public void setClearDate(java.util.Date clearDate) {
        this.clearDate = clearDate;
    }

    public String getAckUsername() {
        return ackUsername;
    }

    public void setAckUsername(String ackUsername) {
        this.ackUsername = ackUsername;
    }

    public java.util.Date getAckDate() {
        return ackDate;
    }

    public void setAckDate(java.util.Date ackDate) {
        this.ackDate = ackDate;
    }

    public int getSiteId() {
        return this.siteId;
    }

    public void setSiteId(int siteId) {
        this.siteId = siteId;
    }
}