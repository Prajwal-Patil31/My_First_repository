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


    /**
     * @return the faultId
     */
    public int getFaultId() {
        return faultId;
    }

    /**
     * @param faultId the faultId to set
     */
    public void setFaultId(final int faultId) {
        this.faultId = faultId;
    }

    /**
     * @return the faultGenDate
     */
    public java.util.Date getFaultDate() {
        return faultDate;
    }

    /**
     * @param faultGenDate the faultGenDate to set
     */
    public void setFaultDate(java.util.Date faultDate) {
        this.faultDate = faultDate;
    }

    /**
     * @return the severity
     */
    public int getSeverity() {
        return severity;
    }

    /**
     * @param severity the faultId to set
     */
    public void setSeverity(final int severity) {
        this.severity = severity;
    }
    
    /**
     * @return the faultErrorCode
     */
    public int getFaultErrorCode() {
        return faultErrorCode;
    }

    /**
     * @param faultErrorCode the faultErrorCode to set
     */
    public void setFaultErrorCode(final int faultErrorCode) {
        this.faultErrorCode = faultErrorCode;
    }

    /**
     * @return the relatedFaultId
     */
    public int getRelatedFaultId() {
        return relatedFaultId;
    }

    /**
     * @param relatedFaultId the relatedFaultId to set
     */
    public void setRelatedFaultId(int relatedFaultId) {
        this.relatedFaultId = relatedFaultId;
    }

    /**
     * @return the faultOrigSubsysId
     */
    public String getFaultSysId() {
        return faultSysId;
    }

    /**
     * @param faultSysId the faultOrigSubsysId to set
     */
    public void setFaultSysId(String faultSysId) {
        this.faultSysId = faultSysId;
    }

    /**
     * @return the host
     */
    public String getHost() {
        return hostname;
    }

    /**
     * @param hostname the host to set
     */
    public void setHost(final String hostname) {
        this.hostname = hostname;
    }

    /**
     * @return the count
     */
    public int getCount() {
        return count;
    }

    /**
     * @param count the count to set
     */
    public void setCount(int count) {
        this.count = count;
    }

    /**
     * @return the statusCode
     */
    public int getStatusCode() {
        return statusCode;
    }

    /**
     * @param statusCode the statusCode to set
     */
    public void setStatusCode(final int statusCode) {
        this.statusCode = statusCode;
    }

    /**
     * @return the faultContent
     */
    public String getFaultContent() {
        return faultContent;
    }

    /**
     * @param faultContent the faultContent to set
     */
    public void setFaultContent(final String faultContent) {
        this.faultContent = faultContent;
    }

    /**
     * @return the clearUsername
     */
    public String getClearUsername() {
        return clearUsername;
    }

    /**
     * @param clearUsername the clearUsername to set
     */
    public void setClearUsername(final String clearUsername) {
        this.clearUsername = clearUsername;
    }

    /**
     * @return the clearDate
     */
    public java.util.Date getClearDate() {
        return clearDate;
    }

    /**
     * @param clearDate the clearDate to set
     */
    public void setClearDate(java.util.Date clearDate) {
        this.clearDate = clearDate;
    }

    /**
     * @return the ackUsername
     */
    public String getAckUsername() {
        return ackUsername;
    }

    /**
     * @param ackUsername the ackUsername to set
     */
    public void setAckUsername(String ackUsername) {
        this.ackUsername = ackUsername;
    }

    /**
     * @return the ackDate
     */
    public java.util.Date getAckDate() {
        return ackDate;
    }

    /**
     * @param ackDate the ackDate to set
     */
    public void setAckDate(java.util.Date ackDate) {
        this.ackDate = ackDate;
    }

    /**
     * @return the Site ID
     */
    public int getSiteId() {
        return this.siteId;
    }

    /**
     * @param siteId the Site ID to set
     */
    public void setSiteId(int siteId) {
        this.siteId = siteId;
    }
}