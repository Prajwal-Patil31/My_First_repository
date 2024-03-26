package in.utl.noa.model;

import in.utl.noa.model.PasswordPolicy;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;


@RepositoryRestResource(collectionResourceRel = "security-policies-password", path = "security-policies-password")
public interface PasswordPolicyRepository extends JpaRepository<PasswordPolicy, Integer> {

    public PasswordPolicy findByPolicyId(int policyId);
    public PasswordPolicy findByPolicyName(String name);

}
