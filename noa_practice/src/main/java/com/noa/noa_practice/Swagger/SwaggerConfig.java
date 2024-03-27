package com.noa.noa_practice.Swagger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig 
{
    /*Docket is an object it will represent that for which component you will have to generate the document */
    @Bean
    public Docket restApi()
    {
     Docket docket = new Docket(DocumentationType.SWAGGER_2)
     .apiInfo(getInfo())
     .select()
     .apis(RequestHandlerSelectors.any())
     .paths(PathSelectors.any())
     .build();
     return docket;
    }

    public ApiInfo getInfo() {
        Contact contact = new Contact(
            "Prajwal Patil",
            "https://watchmeonpatil.netlify.app",
            "prajwalmp31@gmail.com"
        );
    
        ApiInfo apiInfo = new ApiInfoBuilder()
            .title("Noa_Practice Project: Backend Application")
            .description("This is a practice project integrating multiple modules and exposing various functionalities.")
            .version("1.0")
            .termsOfServiceUrl("Unlimited service until and unless you understand the things")
            .contact(contact)
            .license("License")
            .licenseUrl("License URL")
            .build();
            return apiInfo;
    }
}
