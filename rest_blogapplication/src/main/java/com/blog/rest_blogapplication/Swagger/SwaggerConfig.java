package com.blog.rest_blogapplication.Swagger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
public class SwaggerConfig 
{

@Bean
 public Docket api()
 {
    return new Docket(DocumentationType.SWAGGER_2)
    .apiInfo(getInfo()).select().apis(RequestHandlerSelectors.any())
    .paths(PathSelectors.any())
    .build();

 }
    
 public ApiInfo getInfo()
 {
   
    return new ApiInfoBuilder()
    .title("Blogging application")
    .description("This is a blogging application")
    .version("1.0")
    .termsOfServiceUrl("Terms and Conditions")
    .contact(new springfox.documentation.service.Contact("Prajwal Patil", "https://watchmeonpatil.netlify.app", "prajwalmp31@gmail.com"))
    .license("License approved")
    .licenseUrl("License URL _ _ _")
    .build();
}
}

