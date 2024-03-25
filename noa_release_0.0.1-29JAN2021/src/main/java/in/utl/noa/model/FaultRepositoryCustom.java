package in.utl.noa.model;

import java.util.Date;

public interface FaultRepositoryCustom {
    public boolean clearFaults(int errorCode, String troubleSubSysId);

    public boolean isDuplicateFault(int errorCode, String troubleSubSysId);
    
    public Fault updateFaultCountAndDate(int errorCode, String troubleSubSysId, Date genDate);
}