package in.utl.noa.model;

import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

public class FaultConfigRepositoryCustomImpl implements FaultConfigRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional
    public FaultConfig isFaultConfigured(int errorCode) {
        FaultConfig faultConf = null;
        Query q = em.createQuery("SELECT a FROM FaultConfig a WHERE a.faultErrorCode = :errorCode");
        q.setParameter("errorCode", errorCode);

        try {
            faultConf = (FaultConfig) q.getSingleResult();
        } catch (NoResultException e) {
        }
        return faultConf == null ? null : faultConf;
    }
}