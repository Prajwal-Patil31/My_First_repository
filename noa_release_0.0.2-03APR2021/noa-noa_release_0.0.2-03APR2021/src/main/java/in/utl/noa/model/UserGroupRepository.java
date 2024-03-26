package in.utl.noa.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "security-groups", path = "security-groups")
public interface UserGroupRepository extends JpaRepository<UserGroup, Integer> {

    UserGroup findByGroupName(String string);

}
