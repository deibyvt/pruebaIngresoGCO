package com.prueba.gco.config;

import com.prueba.gco.model.*;
import com.prueba.gco.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TipoDocumentoRepository tipoDocumentoRepository;
    private final MarcaRepository marcaRepository;
    private final PaisRepository paisRepository;
    private final DepartamentoRepository departamentoRepository;
    private final CiudadRepository ciudadRepository;

    @Override
    @Transactional
    public void run(String... args) {
        inicializarTiposDocumento();
        inicializarMarcas();
        inicializarGeografia();
    }

    private void inicializarTiposDocumento() {
        if (tipoDocumentoRepository.count() > 0) {
            return;
        }
        List<TipoDocumento> tipos = Arrays.asList(
            TipoDocumento.builder().codigo("CC").nombre("Cédula de Ciudadanía").activo(true).build(),
            TipoDocumento.builder().codigo("CE").nombre("Cédula de Extranjería").activo(true).build(),
            TipoDocumento.builder().codigo("PA").nombre("Pasaporte").activo(true).build(),
            TipoDocumento.builder().codigo("TI").nombre("Tarjeta de Identidad").activo(true).build(),
            TipoDocumento.builder().codigo("PEP").nombre("Permiso Especial de Permanencia").activo(true).build()
        );
        tipoDocumentoRepository.saveAll(tipos);
    }

    private void inicializarMarcas() {
        if (marcaRepository.count() > 0) {
            return;
        }
        List<Marca> marcas = Arrays.asList(
            Marca.builder()
                .codigo("AMERICANINO")
                .nombre("Americanino")
                .descripcion("Moda juvenil urbana y denim auténtico.")
                .activo(true)
                .build(),
            Marca.builder()
                .codigo("AMERICAN_EAGLE")
                .nombre("American Eagle")
                .descripcion("Denim de alta calidad, comodidad y estilo relajado.")
                .activo(true)
                .build(),
            Marca.builder()
                .codigo("CHEVIGNON")
                .nombre("Chevignon")
                .descripcion("Herencia francesa, prendas de cuero y mezclilla icónica.")
                .activo(true)
                .build(),
            Marca.builder()
                .codigo("ESPRIT")
                .nombre("Esprit")
                .descripcion("Estilo californiano, frescura y moda casual contemporánea.")
                .activo(true)
                .build(),
            Marca.builder()
                .codigo("NAF_NAF")
                .nombre("Naf Naf")
                .descripcion("Moda femenina sofisticada, audaz y vanguardista.")
                .activo(true)
                .build(),
            Marca.builder()
                .codigo("RIFLE")
                .nombre("Rifle")
                .descripcion("Tradición y durabilidad en jeans y prendas casuales.")
                .activo(true)
                .build()
        );
        marcaRepository.saveAll(marcas);
    }

    private void inicializarGeografia() {
        if (paisRepository.count() > 0) {
            return;
        }

        Pais colombia = Pais.builder()
            .codigo("CO")
            .nombre("Colombia")
            .build();
        colombia = paisRepository.save(colombia);

        Departamento antioquia = crearDepto("Antioquia", colombia);
        Departamento cundinamarca = crearDepto("Cundinamarca", colombia);
        Departamento valle = crearDepto("Valle del Cauca", colombia);
        Departamento atlantico = crearDepto("Atlántico", colombia);
        Departamento santander = crearDepto("Santander", colombia);
        Departamento bolivar = crearDepto("Bolívar", colombia);
        Departamento risaralda = crearDepto("Risaralda", colombia);
        Departamento caldas = crearDepto("Caldas", colombia);

        crearCiudades(antioquia, "Medellín", "Envigado", "Itagüí", "Bello", "Sabaneta", "Rionegro");
        crearCiudades(cundinamarca, "Bogotá D.C.", "Soacha", "Chía", "Zipaquirá", "Facatativá");
        crearCiudades(valle, "Cali", "Palmira", "Buenaventura", "Tuluá", "Buga");
        crearCiudades(atlantico, "Barranquilla", "Soledad", "Malambo");
        crearCiudades(santander, "Bucaramanga", "Floridablanca", "Girón", "Piedecuesta");
        crearCiudades(bolivar, "Cartagena", "Magangué");
        crearCiudades(risaralda, "Pereira", "Dosquebradas", "Santa Rosa de Cabal");
        crearCiudades(caldas, "Manizales", "Villamaría", "Chinchiná");
    }

    private Departamento crearDepto(String nombre, Pais pais) {
        return departamentoRepository.save(
            Departamento.builder().nombre(nombre).pais(pais).build()
        );
    }

    private void crearCiudades(Departamento depto, String... nombres) {
        for (String nombre : nombres) {
            ciudadRepository.save(
                Ciudad.builder().nombre(nombre).departamento(depto).build()
            );
        }
    }
}
