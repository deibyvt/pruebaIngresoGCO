package com.prueba.gco.controller;

import com.prueba.gco.dto.ClienteRegistroRequestDTO;
import com.prueba.gco.dto.ClienteResponseDTO;
import com.prueba.gco.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@Tag(name = "Clientes y Fidelización", description = "Endpoints para la inscripción y consulta de clientes en programas de fidelidad GCO")
public class ClienteController {

    private final ClienteService clienteService;

    @PostMapping
    @Operation(summary = "Inscribir cliente en programa de fidelidad", description = "Registra un cliente en una de las marcas de GCO validando datos y Habeas Data")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Cliente inscrito con éxito"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos o faltantes"),
        @ApiResponse(responseCode = "404", description = "Catálogo referenciado no encontrado"),
        @ApiResponse(responseCode = "409", description = "El cliente ya se encuentra inscrito en esta marca")
    })
    public ResponseEntity<ClienteResponseDTO> registrarCliente(@Valid @RequestBody ClienteRegistroRequestDTO request) {
        ClienteResponseDTO nuevoCliente = clienteService.registrarCliente(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCliente);
    }

    @GetMapping
    @Operation(summary = "Listar clientes inscritos", description = "Devuelve todos los clientes inscritos en los programas de fidelización")
    public ResponseEntity<List<ClienteResponseDTO>> listarClientes() {
        return ResponseEntity.ok(clienteService.listarClientes());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar cliente por ID", description = "Obtiene el detalle completo de un cliente por su identificador único")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<ClienteResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.obtenerPorId(id));
    }
}

