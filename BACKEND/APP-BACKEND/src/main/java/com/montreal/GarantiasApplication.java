package com.montreal;

import com.montreal.oauth.helpers.RefreshableCRUDRepositoryImpl;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories(repositoryBaseClass = RefreshableCRUDRepositoryImpl.class)
@SpringBootApplication
public class GarantiasApplication {
    public static void main(String[] args) {
        SpringApplication.run(GarantiasApplication.class, args);
    }
}
