package in.utl.noa.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.SequenceGenerator;

@Entity
@Table(name = "audit_info")
public class AuditInfo {

	private static final long serialVersionUID = 6529685098267757690L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "noa.audit_info_audit_id_seq", initialValue = 1, allocationSize = 1)
	@Column(name = "audit_id")
	private int auditId;

	@Column(name = "user_name")
	private String userName;

	@Column(name = "time")
	private java.util.Date time;

	@Column(name = "operation")
	private String operation;

	@Column(name = "status")
	private String status;

	@Column(name = "host")
	private String host;

	@Column(name = "activity")
	private String activity;

	@Column(name = "api_name")
	private String apiName;

	@Column(name = "change_description")
	private String desc;


	public int getAuditId() {
		return auditId;
	}

	public void setAuditId(int auditId) {
		this.auditId = auditId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public java.util.Date getTime() {
		return time;
	}

	public void setTime(java.util.Date time) {
		this.time = time;
	}

	public String getOperation(){
		return operation;
	}
	
	public void setOperation(String operation) {
		this.operation = operation;
	}

	/**
	*@return the status
	*/
	public String getStatus(){
		return status;
	}

	/**
	*@param status the status to set
	*/
	public void setStatus(String status) {
		this.status = status;
	}

	/**
	*@return the host
	*/
	public String getHost() {
		return host;
	}

	/**
	*@param host the host to set
	*/
	public void setHost(String host) {
		this.host = host;
	}

	/**
	*@return the activity
	*/
	public String getActivity() {
		return activity;
	}

	/**
	*@param activity the activity to set
	*/
	public void setActivity(String activity) {
		this.activity = activity;
	}

	/**
	*@return the apiName
	*/
	public String getApiName() {
		return apiName;
	}

	/**
	*@param apiName the apiName to set
	*/
	public void setApiName(String apiName) {
		this.apiName = apiName;
	}

	/**
	*@return the desc
	*/
	public String getDesc() {
		return desc;
	}

	/**
	*@param desc the desc to set
	*/
	public void setDesc(String desc) {
		this.desc = desc;
	}

}
