package com.prueba.gco.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Catálogo para las marcas del Grupo Uribe (GCO):
 * Americanino, American Eagle, Chevignon, Esprit, Naf Naf, Rifle.
 */
@Entity
@Table(name = "marcas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Marca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String codigo; // Ej: "AMERICANINO", "CHEVIGNON"

    @Column(nullable = false, length = 80)
    private String nombre; // Ej: "Americanino", "American Eagle"

    @Column(length = 255)
    private String descripcion;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;
}

