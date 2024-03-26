package in.utl.noa.model;

import in.utl.noa.model.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "security-roles", path = "security-roles")
public interface RoleRepository extends JpaRepository<Role, Integer> {

    public Role findByRoleId(int id);
    public Role findByRoleName(String name);
}