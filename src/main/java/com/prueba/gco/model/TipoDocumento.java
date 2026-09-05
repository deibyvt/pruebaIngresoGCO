package com.prueba.gco.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Catálogo para los tipos de identificación disponibles:
 * CC (Cédula de Ciudadanía), CE (Cédula de Extranjería), TI (Tarjeta de Identidad), PP (Pasaporte), etc.
 */
@Entity
@Table(name = "tipos_documento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoDocumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String codigo; // Ej: "CC", "CE", "PA", "TI"

    @Column(nullable = false, length = 60)
    private String nombre; // Ej: "Cédula de Ciudadanía"

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;
}

