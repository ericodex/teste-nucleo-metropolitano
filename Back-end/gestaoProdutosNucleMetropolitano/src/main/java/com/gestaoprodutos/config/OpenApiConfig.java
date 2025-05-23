package com.gestaoprodutos.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", scheme = "bearer")
public class OpenApiConfig {

        @Bean
        public OpenAPI customOpenAPI() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("Gestão de Produtos API")
                                                .version("1.0")
                                                .description("API para gerenciamento de usuários e produtos")
                                                .contact(new Contact()
                                                                .name("Suporte")
                                                                .email("ericodigos@gmail.com"))
                                                .license(new License()
                                                                .name("")))
                                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
        }

        @Bean
        public GroupedOpenApi authApi() {
                return GroupedOpenApi.builder()
                                .group("autenticacao")
                                .pathsToMatch("/api/v1/auth/**")
                                .build();
        }

        @Bean
        public GroupedOpenApi publicApi() {
                return GroupedOpenApi.builder()
                                .group("public")
                                .pathsToMatch("/api/v1/**")
                                .build();
        }
}