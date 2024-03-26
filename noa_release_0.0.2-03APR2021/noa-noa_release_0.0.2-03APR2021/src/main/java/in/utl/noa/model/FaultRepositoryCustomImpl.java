package in.utl.noa.model;

import static in.utl.noa.util.FaultConstants.*;

import org.springframework.transaction.annotation.Transactional;

import org.apache.log4j.Logger;

import java.util.Calendar;
import java.util.List;
import java.util.Date;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

public class FaultRepositoryCustomImpl implements FaultRepositoryCustom {
    
    private static Logger logger = Logger.getLogger(FaultRepositoryCustomImpl.class);

    @PersistenceContext
    private EntityManager em;
    
    @Transactional
    public boolean clearFaults(int errorCode, String troubleSysId) {
        List<Fault> faults = null;
        Query q = em.createQuery("SELECT a FROM Fault a WHERE a.faultErrorCode = :errorCode " + 
                                 "AND a.faultTroubleSysId = :troubleSysId AND a.statusCode " +
                                 "!= :clearStatus");
        q.setParameter("errorCode", errorCode);
        q.setParameter("troubleSysId", troubleSysId);
        q.setParameter("clearStatus", FAULT_CLEAR_STATUS);

        try {
            faults = (List<Fault>)q.getResultList();
        } catch (NoResultException e) {
        }

        if(faults.isEmpty()) {
			return false;
        }
        
        Calendar cal = Calendar.getInstance();
		java.util.Date today = cal.getTime();
		for(Fault fault : faults){
			fault.setStatusCode(FAULT_CLEAR_STATUS);
			fault.setClearUsername(FAULT_CLEAR_USERNAME);
			fault.setClearDate(today);
			em.persist(fault);
        }
		return true;
    }

    @Transactional
    public boolean isDuplicateFault(int errorCode, String troubleSysId) {
		List<Fault> faults = null;
        boolean status = false;
        
        Query q = em.createQuery("SELECT a FROM Fault a WHERE a.faultErrorCode = :errorCode " + 
                                 "AND a.faultTroubleSysId = :troubleSysId AND a.statusCode " +
                                 "!= :clearStatus");
        q.setParameter("errorCode", errorCode);
        q.setParameter("troubleSysId", troubleSysId);
        q.setParameter("clearStatus", FAULT_CLEAR_STATUS);

        try {
            faults = (List<Fault>)q.getResultList();
        } catch (NoResultException e) {
        }

		if(!faults.isEmpty()){
			status = true;
		}
		return status;
    }
    
    @Transactional
    public Fault updateFaultCountAndDate(int errorCode, String troubleSysId, Date genDate) {
        List<Fault> faults = null;
        Query q = em.createQuery("SELECT a FROM Fault a WHERE a.faultErrorCode = :errorCode AND " +
                                 "a.faultTroubleSysId = :troubleSysId AND " +
                                 "a.statusCode != :clearStatus");
        q.setParameter("errorCode", errorCode);
        q.setParameter("troubleSysId", troubleSysId);
        q.setParameter("clearStatus", FAULT_CLEAR_STATUS);
        
        try {
            faults = (List<Fault>)q.getResultList();
        } catch (NoResultException e) {
        }

		if(faults.isEmpty()) {
            logger.info("updateFaultCountAndDate:: No Duplicate Faults Found for Updating Count");
            return null;    
        }

        Fault fault = faults.get(0);
        int count = fault.getCount();
        fault.setCount(count + 1);
        fault.setFaultDate(genDate);
        em.persist(fault);

        logger.info("updateFaultCountAndDate:: Updated Duplicate Fault Count");
        return fault;
	}
}