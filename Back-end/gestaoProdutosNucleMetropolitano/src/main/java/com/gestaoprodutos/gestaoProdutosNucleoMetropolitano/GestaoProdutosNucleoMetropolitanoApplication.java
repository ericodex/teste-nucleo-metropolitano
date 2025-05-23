package com.gestaoprodutos.gestaoProdutosNucleoMetropolitano;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan; // Importar
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EntityScan(basePackages = "com.gestaoprodutos.model.entity")
@EnableJpaRepositories(basePackages = "com.gestaoprodutos.repository")
@EnableJpaAuditing
@ComponentScan(basePackages = "com.gestaoprodutos")
public class GestaoProdutosNucleoMetropolitanoApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestaoProdutosNucleoMetropolitanoApplication.class, args);
	}
}