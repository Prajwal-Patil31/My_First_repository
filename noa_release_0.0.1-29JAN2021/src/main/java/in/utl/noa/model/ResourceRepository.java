package in.utl.noa.model;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(collectionResourceRel = "elements", path = "elements")
public interface ResourceRepository extends CrudRepository<Resource, Integer> {

    Resource findByResourceId(Integer resourceId);
}
