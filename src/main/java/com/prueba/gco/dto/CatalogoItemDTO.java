package com.prueba.gco.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO genérico para elementos de catálogo (tipo documento, marca, país, etc.)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatalogoItemDTO {
    private Long id;
    private String codigo;
    private String nombre;
    private String descripcion;
}

