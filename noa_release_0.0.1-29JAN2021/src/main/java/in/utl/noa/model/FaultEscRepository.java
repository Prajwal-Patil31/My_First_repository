package in.utl.noa.model;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(collectionResourceRel = "faults-policies-escalate", path = "faults-policies-escalate")
public interface FaultEscRepository extends JpaRepository<FaultEscalatePolicy, Integer> {

    public Optional<FaultEscalatePolicy>findByPolicyId(Integer policyId);

}