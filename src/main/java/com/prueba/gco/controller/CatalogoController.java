package com.prueba.gco.controller;

import com.prueba.gco.dto.CatalogoItemDTO;
import com.prueba.gco.dto.CiudadDTO;
import com.prueba.gco.dto.DepartamentoDTO;
import com.prueba.gco.service.CatalogoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogos")
@RequiredArgsConstructor
@Tag(name = "Catálogos", description = "Endpoints para alimentar las listas desplegables del formulario de fidelización")
public class CatalogoController {

    private final CatalogoService catalogoService;

    @GetMapping("/tipos-documento")
    @Operation(summary = "Listar tipos de identificación", description = "Devuelve los tipos de documentos activos (CC, CE, TI, etc.)")
    public ResponseEntity<List<CatalogoItemDTO>> listarTiposDocumento() {
        return ResponseEntity.ok(catalogoService.listarTiposDocumento());
    }

    @GetMapping("/marcas")
    @Operation(summary = "Listar marcas de GCO", description = "Devuelve las marcas del Grupo Uribe disponibles para fidelización")
    public ResponseEntity<List<CatalogoItemDTO>> listarMarcas() {
        return ResponseEntity.ok(catalogoService.listarMarcas());
    }

    @GetMapping("/paises")
    @Operation(summary = "Listar países", description = "Devuelve el catálogo de países")
    public ResponseEntity<List<CatalogoItemDTO>> listarPaises() {
        return ResponseEntity.ok(catalogoService.listarPaises());
    }

    @GetMapping("/departamentos/{paisId}")
    @Operation(summary = "Listar departamentos por país", description = "Devuelve los departamentos asociados al país seleccionado")
    public ResponseEntity<List<DepartamentoDTO>> listarDepartamentosPorPais(@PathVariable Long paisId) {
        return ResponseEntity.ok(catalogoService.listarDepartamentosPorPais(paisId));
    }

    @GetMapping("/ciudades/{departamentoId}")
    @Operation(summary = "Listar ciudades por departamento", description = "Devuelve las ciudades o municipios asociados al departamento seleccionado")
    public ResponseEntity<List<CiudadDTO>> listarCiudadesPorDepartamento(@PathVariable Long departamentoId) {
        return ResponseEntity.ok(catalogoService.listarCiudadesPorDepartamento(departamentoId));
    }
}

