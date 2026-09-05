package com.prueba.gco.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de OpenAPI 3 / Swagger para documentación interactiva de la API.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("API Programa de Fidelización - GCO (Grupo Uribe)")
                .version("1.0.0")
                .description("API REST para el registro y gestión de clientes en los programas de fidelidad de marcas GCO: Americanino, American Eagle, Chevignon, Esprit, Naf Naf y Rifle.")
                .contact(new Contact()
                    .name("Área de Medios Digitales - GCO")
                    .email("mediosdigitales@grupouribe.com"))
                .license(new License()
                    .name("GCO Proprietary")));
    }
}

