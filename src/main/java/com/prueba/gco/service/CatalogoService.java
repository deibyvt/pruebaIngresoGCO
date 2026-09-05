package com.prueba.gco.service;

import com.prueba.gco.dto.CatalogoItemDTO;
import com.prueba.gco.dto.CiudadDTO;
import com.prueba.gco.dto.DepartamentoDTO;
import com.prueba.gco.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogoService {

    private final TipoDocumentoRepository tipoDocumentoRepository;
    private final MarcaRepository marcaRepository;
    private final PaisRepository paisRepository;
    private final DepartamentoRepository departamentoRepository;
    private final CiudadRepository ciudadRepository;

    public List<CatalogoItemDTO> listarTiposDocumento() {
        return tipoDocumentoRepository.findByActivoTrue()
            .stream()
            .map(td -> CatalogoItemDTO.builder()
                .id(td.getId())
                .codigo(td.getCodigo())
                .nombre(td.getNombre())
                .build())
            .toList();
    }

    public List<CatalogoItemDTO> listarMarcas() {
        return marcaRepository.findByActivoTrue()
            .stream()
            .map(m -> CatalogoItemDTO.builder()
                .id(m.getId())
                .codigo(m.getCodigo())
                .nombre(m.getNombre())
                .descripcion(m.getDescripcion())
                .build())
            .toList();
    }

    public List<CatalogoItemDTO> listarPaises() {
        return paisRepository.findAll()
            .stream()
            .map(p -> CatalogoItemDTO.builder()
                .id(p.getId())
                .codigo(p.getCodigo())
                .nombre(p.getNombre())
                .build())
            .toList();
    }

    public List<DepartamentoDTO> listarDepartamentosPorPais(Long paisId) {
        return departamentoRepository.findByPaisId(paisId)
            .stream()
            .map(d -> DepartamentoDTO.builder()
                .id(d.getId())
                .nombre(d.getNombre())
                .paisId(d.getPais().getId())
                .build())
            .toList();
    }

    public List<CiudadDTO> listarCiudadesPorDepartamento(Long departamentoId) {
        return ciudadRepository.findByDepartamentoId(departamentoId)
            .stream()
            .map(c -> CiudadDTO.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .departamentoId(c.getDepartamento().getId())
                .build())
            .toList();
    }
}

