package in.utl.noa;

import java.security.Policy;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import in.utl.noa.model.FeatureRepository;
import in.utl.noa.model.RoleRepository;
import in.utl.noa.model.UserAccountRepository;
import in.utl.noa.model.Feature;
import in.utl.noa.model.Role;
import in.utl.noa.model.PasswordPolicy;  
import in.utl.noa.model.PasswordPolicyRepository;
import in.utl.noa.model.UserAccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DefaultDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    private boolean setup = false;

    @Autowired
    private UserAccountRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private FeatureRepository featureRepository;

    @Autowired
    private PasswordPolicyRepository policyRepository;

    @Override
    @Transactional
    public void onApplicationEvent(final ContextRefreshedEvent event) {
        
        if (setup) {
            return;
        }

        final List<Feature> adminFeatures = new ArrayList<Feature>(Arrays.asList(
            createFeatureIfNotFound("AlarmManagement"),
            createFeatureIfNotFound("TopologyManagement"),
            createFeatureIfNotFound("ConfigManagement"),
            createFeatureIfNotFound("PerformanceManagement"),
            createFeatureIfNotFound("SecurityManagement"),
            createFeatureIfNotFound("LogManagement"),
            createFeatureIfNotFound("DiagnosticsManagement"),
            createFeatureIfNotFound("InventoryManagement"),
            createFeatureIfNotFound("MeasurementCountersAndThresholdManagement")
            ));

        final List<Feature> userFeatures = new ArrayList<Feature>(Arrays.asList(
            createFeatureIfNotFound("TopologyManagementViewOnly"),
            createFeatureIfNotFound("ConfigManagementViewOnly"),
            createFeatureIfNotFound("PerformanceManagementViewOnly"),
            createFeatureIfNotFound("SecurityManagementViewOnly"),
            createFeatureIfNotFound("LogManagementViewOnly"),
            createFeatureIfNotFound("AlarmManagementViewOnly"),
            createFeatureIfNotFound("DiagnosticsManagementViewOnly"),
            createFeatureIfNotFound("InventoryManagementViewOnly")
            ));

        /* final Feature passwordFeature = createFeatureIfNotFound("ChangePassword"); */

        final Role adminRole = createRoleIfNotFound("Administrator", adminFeatures);
        final Role userRole = createRoleIfNotFound("DefaultRole", userFeatures);
        final PasswordPolicy policy = createPolicyIfNotFound(5, "WeeklyExpire");

        createUserIfNotFound("admin", "Administrator", "NOA", "pass", adminRole, policy);
        createUserIfNotFound("user", "User", "NOA", "pass", userRole, policy);
        createUserIfNotFound("noaadmin", "NOA", "Administrator", "noapass", adminRole, policy);

        setup = true;
    }

    @Transactional
    private final Feature createFeatureIfNotFound(final String name) {
        Feature feature = featureRepository.findByFeatureName(name);

        if (feature == null) {
            feature = new Feature(name);
            feature = featureRepository.save(feature);
        }

        return feature;
    }
    @Transactional
    private final PasswordPolicy createPolicyIfNotFound(final Integer id, final String name) {
        PasswordPolicy policy = policyRepository.findByPolicyId(id);
        if(policy == null) 
        {
            policy = new PasswordPolicy(id, name);
        }
        policy = policyRepository.save(policy);
        return policy;
    }
 

    @Transactional
    private final Role createRoleIfNotFound(final String name, final List<Feature> features) {
        Role role = roleRepository.findByRoleName(name);

        if (role == null) {
            role = new Role(name);
        }
        role.setFeatures(features);
        role = roleRepository.save(role);

        return role;
    }

    @Transactional
    private final UserAccount createUserIfNotFound(final String userid, final String firstName,
    final String lastName, final String password, final Role role, final PasswordPolicy policy) {
        UserAccount user = userRepository.findByUserId(userid);

        if (user == null) {
            user = new UserAccount(userid, UserAccount.PASSWORD_ENCODER.encode(password));
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setUserId(userid);
        }

        user.setRole(role);
        user.setPolicyId(policy);
        user = userRepository.save(user);
        
        return user;
    }
}
