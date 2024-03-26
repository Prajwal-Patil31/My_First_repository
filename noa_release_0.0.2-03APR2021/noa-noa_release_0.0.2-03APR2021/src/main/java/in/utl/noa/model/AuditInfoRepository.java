package in.utl.noa.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "security-audit", path = "security-audit")
public interface AuditInfoRepository extends JpaRepository<AuditInfo, Integer> {

    public Optional<AuditInfo> findByauditId(int auditId);   
}