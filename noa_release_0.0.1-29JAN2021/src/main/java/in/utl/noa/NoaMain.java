package in.utl.noa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
import org.springframework.context.annotation.Bean;

import in.utl.noa.model.UserAccount;
import in.utl.noa.model.UserGroup;
import in.utl.noa.model.PasswordPolicy;
import in.utl.noa.model.Role;
import in.utl.noa.model.Feature;
import in.utl.noa.model.AuditInfo;
import in.utl.noa.model.Resource;
import in.utl.noa.model.ResourceGroup;
import in.utl.noa.model.Fault;
import in.utl.noa.model.FaultAcknowledgePolicy;
import in.utl.noa.model.FaultEscalatePolicy;
import in.utl.noa.model.FaultConfig;
import org.modelmapper.ModelMapper;


@SpringBootApplication
public class NoaMain {

	public static void main(String[] args) {
		SpringApplication.run(NoaMain.class, args);
	}

	@Configuration
	public class RepositoryConfig extends RepositoryRestConfigurerAdapter {
    @Override
    	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		config.exposeIdsFor(UserAccount.class ,PasswordPolicy.class, Role.class, Feature.class, 
							PasswordPolicy.class, AuditInfo.class, UserGroup.class, Resource.class, ResourceGroup.class,
							Fault.class, FaultAcknowledgePolicy.class, FaultEscalatePolicy.class, FaultConfig.class
							);
	}
	
	@Configuration
	public class NoaAppConfig {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
}

}
