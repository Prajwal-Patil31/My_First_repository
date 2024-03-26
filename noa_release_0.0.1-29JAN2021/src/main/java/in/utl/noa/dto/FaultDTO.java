package in.utl.noa.dto;

public class FaultDTO {

	private int faultId;

	private String errorCode;

	private String faultContent;

	private long timeOfDay;

	private String systemId;

	public char status;
	
	private String clearedBy;

	private String siteId;

	public int getFaultId() {
		return faultId;
	}

	public void setFaultId(int faultId) {
		this.faultId = faultId;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getFaultContent() {
		return faultContent;
	}

	public void setFaultContent(String faultContent) {
		this.faultContent = faultContent;
	}

	public long getTimeOfDay() {
		return timeOfDay;
	}

	public void setTimeOfDay(long timeOfDay) {
		this.timeOfDay = timeOfDay;
	}

	public String getSystemId() {
		return systemId;
	}

	public void setSystemId(String systemId) {
		this.systemId = systemId;
	}

	public char getStatus() {
		return status;
	}

	public void setStatus(char status) {
		this.status = status;
	}

	public String getClearedBy() {
		return clearedBy;
	}

	public void setClearedBy(String clearedBy) {
		this.clearedBy = clearedBy;
	}

	public String getSiteId() {
		return siteId;
	}

	public void setSiteId(String siteId) {
		this.siteId = siteId;
	}

	@Override
	public String toString() {
		return "FaultDTO [faultId=" + faultId + ", errorCode=" + errorCode + ", faultContent=" + faultContent
				+ ", timeOfDay=" + timeOfDay + ", systemId=" + systemId + ", status=" + status + ", clearedBy=" 
				+ clearedBy	+ ", siteId=" + siteId + "]";
	}

	
}
