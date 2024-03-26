package in.utl.noa.model;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(collectionResourceRel = "security-users", path = "security-users")
public interface UserAccountRepository extends CrudRepository<UserAccount, Integer> {

    UserAccount findByAccountId(Integer accountId);
    UserAccount findByUserId(String userId);
}
