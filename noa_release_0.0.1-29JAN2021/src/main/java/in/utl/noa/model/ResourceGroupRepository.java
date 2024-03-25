package in.utl.noa.model;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(collectionResourceRel = "elements-groups", path = "elements-groups")
public interface ResourceGroupRepository extends CrudRepository<ResourceGroup, Integer> {
}
