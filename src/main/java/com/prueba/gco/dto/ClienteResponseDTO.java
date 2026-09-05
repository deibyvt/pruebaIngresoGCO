package com.prueba.gco.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para devolver la información estructurada y enriquecida del cliente registrado.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteResponseDTO {

    private Long id;
    
    // Identificación
    private Long tipoDocumentoId;
    private String tipoDocumentoCodigo;
    private String tipoDocumentoNombre;
    private String numeroDocumento;

    // Personales
    private String nombres;
    private String apellidos;
    private String nombreCompleto;
    private LocalDate fechaNacimiento;
    private String direccion;

    // Ubicación geográfica completa
    private Long ciudadId;
    private String ciudadNombre;
    private Long departamentoId;
    private String departamentoNombre;
    private Long paisId;
    private String paisNombre;

    // Marca
    private Long marcaId;
    private String marcaNombre;

    // Auditoría / Legal
    private Boolean autorizaTratamientoDatos;
    private LocalDateTime fechaRegistro;
}

