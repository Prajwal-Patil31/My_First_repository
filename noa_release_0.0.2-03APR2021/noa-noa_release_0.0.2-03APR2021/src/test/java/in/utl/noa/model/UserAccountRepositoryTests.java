package in.utl.noa.model;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ContextConfiguration;

import in.utl.noa.config.WebMvcBaseTestConfig;

@DataJpaTest
@ContextConfiguration(classes = WebMvcBaseTestConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserAccountRepositoryTests {
    @Autowired
    UserAccountRepository repository;

    @Test
    @DisplayName("Validate Default Accounts")
    public void validateDefaultAccounts() 
    {
        UserAccount user;
        user = repository.findByUserName("admin");
        Assertions.assertNotNull(user.getAccountId());

        user = repository.findByUserName("user");
        Assertions.assertNotNull(user.getAccountId());

        user = repository.findByUserName("noaadmin");
        Assertions.assertNotNull(user.getAccountId());
    }
}
