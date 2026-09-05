package com.prueba.gco.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * DTO para la petición de registro de un cliente en el programa de fidelización.
 * Contiene todas las validaciones de entrada exigidas por el negocio.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteRegistroRequestDTO {

    @NotNull(message = "El tipo de identificación es obligatorio")
    private Long tipoDocumentoId;

    @NotBlank(message = "El número de identificación no puede estar vacío")
    @Size(min = 4, max = 30, message = "El número de documento debe tener entre 4 y 30 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9-]+$", message = "El número de identificación solo puede contener letras, números o guiones")
    private String numeroDocumento;

    @NotBlank(message = "Los nombres son obligatorios")
    @Size(min = 2, max = 100, message = "Los nombres deben tener entre 2 y 100 caracteres")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(min = 2, max = 100, message = "Los apellidos deben tener entre 2 y 100 caracteres")
    private String apellidos;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser una fecha anterior al día de hoy")
    private LocalDate fechaNacimiento;

    @NotBlank(message = "La dirección de residencia es obligatoria")
    @Size(min = 5, max = 200, message = "La dirección debe tener entre 5 y 200 caracteres")
    private String direccion;

    @NotNull(message = "La ciudad de residencia es obligatoria")
    private Long ciudadId;

    @NotNull(message = "La marca para la inscripción es obligatoria")
    private Long marcaId;

    @NotNull(message = "Debe especificar la autorización de tratamiento de datos")
    @AssertTrue(message = "Debe autorizar el tratamiento de datos personales conforme a la política de Habeas Data")
    private Boolean autorizaTratamientoDatos;
}

