package in.utl.noa.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "faults-config", path = "faults-config")
public interface FaultConfigRepository extends JpaRepository<FaultConfig, Integer>, FaultConfigRepositoryCustom {

    public Optional<FaultConfig> findByFaultId(int faultId);
}