package in.utl.noa.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;

@RepositoryRestResource(collectionResourceRel = "faults", path = "faults")
public interface FaultRepository extends JpaRepository<Fault, Integer>, FaultRepositoryCustom {
    
    public Optional<Fault> findByFaultId(int faultId);
}