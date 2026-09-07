package com.prueba.gco.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteResponseDTO {

    private Long id;
    private Long tipoDocumentoId;
    private String tipoDocumentoCodigo;
    private String tipoDocumentoNombre;
    private String numeroDocumento;

    private String nombres;
    private String apellidos;
    private String nombreCompleto;
    private LocalDate fechaNacimiento;
    private String direccion;

    private Long ciudadId;
    private String ciudadNombre;
    private Long departamentoId;
    private String departamentoNombre;
    private Long paisId;
    private String paisNombre;

    private Long marcaId;
    private String marcaNombre;

    private Boolean autorizaTratamientoDatos;
    private LocalDateTime fechaRegistro;
}
