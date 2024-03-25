package in.utl.noa.model;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "faults-policies-acknowledge", path = "faults-policies-acknowledge")
public interface FaultAckRepository extends JpaRepository<FaultAcknowledgePolicy, Integer> {

    public Optional<FaultAcknowledgePolicy> findByPolicyId(Integer policyId);
}