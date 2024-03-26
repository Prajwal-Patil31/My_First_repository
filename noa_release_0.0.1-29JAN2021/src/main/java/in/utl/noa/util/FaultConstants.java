package in.utl.noa.util;

public interface FaultConstants {
    public static final int FAULT_PAGE_SIZE = 10;
	public static final int UNKNOWN_FAULT = 5;
	public static final int NORMAL_FAULT = 4;
	public static final int WARN_FAULT = 3;
	public static final int MINOR_FAULT = 2;
	public static final int MAJOR_FAULT = 1;
	public static final int CRITICAL_FAULT = 0;
	public static final int CLEARING_FAULT = 6;
	public static final int FAULT_CLEAR_STATUS = 2;
	public static final int FAULT_ACKNOWLEDGE_STATUS = 1;
	public static final int FAULT_INITIAL_STATUS = 0;
	public static final String FAULT_CLEAR_USERNAME = "AUTOCLEAR";
}