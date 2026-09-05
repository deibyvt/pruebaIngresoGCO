package com.prueba.gco.service;

import com.prueba.gco.dto.ClienteRegistroRequestDTO;
import com.prueba.gco.dto.ClienteResponseDTO;
import com.prueba.gco.exception.RecursoNoEncontradoException;
import com.prueba.gco.exception.ReglaNegocioException;
import com.prueba.gco.model.Ciudad;
import com.prueba.gco.model.Cliente;
import com.prueba.gco.model.Marca;
import com.prueba.gco.model.TipoDocumento;
import com.prueba.gco.repository.CiudadRepository;
import com.prueba.gco.repository.ClienteRepository;
import com.prueba.gco.repository.MarcaRepository;
import com.prueba.gco.repository.TipoDocumentoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final TipoDocumentoRepository tipoDocumentoRepository;
    private final MarcaRepository marcaRepository;
    private final CiudadRepository ciudadRepository;

    @Transactional
    public ClienteResponseDTO registrarCliente(ClienteRegistroRequestDTO request) {
        log.info("Iniciando registro de cliente: documento {} para marca id {}", 
            request.getNumeroDocumento(), request.getMarcaId());

        // 1. Validar existencia del tipo de documento
        TipoDocumento tipoDocumento = tipoDocumentoRepository.findById(request.getTipoDocumentoId())
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "Tipo de documento no encontrado con id: " + request.getTipoDocumentoId()));

        // 2. Validar existencia de la marca seleccionada
        Marca marca = marcaRepository.findById(request.getMarcaId())
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "Marca no encontrada con id: " + request.getMarcaId()));

        // 3. Validar existencia de la ciudad seleccionada
        Ciudad ciudad = ciudadRepository.findById(request.getCiudadId())
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "Ciudad no encontrada con id: " + request.getCiudadId()));

        // 4. Regla de Negocio: No duplicar cliente dentro de la misma marca
        String docLimpio = request.getNumeroDocumento().trim();
        boolean yaInscrito = clienteRepository.existsByTipoDocumentoIdAndNumeroDocumentoAndMarcaId(
            tipoDocumento.getId(),
            docLimpio,
            marca.getId()
        );

        if (yaInscrito) {
            throw new ReglaNegocioException(
                String.format("El cliente con %s %s ya se encuentra inscrito en el programa de fidelidad de %s.",
                    tipoDocumento.getCodigo(), docLimpio, marca.getNombre())
            );
        }

        // 5. Mapear y construir la entidad
        Cliente cliente = Cliente.builder()
            .tipoDocumento(tipoDocumento)
            .numeroDocumento(docLimpio)
            .nombres(request.getNombres().trim())
            .apellidos(request.getApellidos().trim())
            .fechaNacimiento(request.getFechaNacimiento())
            .direccion(request.getDireccion().trim())
            .ciudad(ciudad)
            .marca(marca)
            .autorizaTratamientoDatos(request.getAutorizaTratamientoDatos())
            .build();

        Cliente guardado = clienteRepository.save(cliente);
        log.info("Cliente registrado con éxito id: {}", guardado.getId());

        // 6. Retornar DTO de respuesta limpio
        return mapearADTO(guardado);
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listarClientes() {
        return clienteRepository.findAll()
            .stream()
            .map(this::mapearADTO)
            .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponseDTO obtenerPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado con id: " + id));
        return mapearADTO(cliente);
    }

    private ClienteResponseDTO mapearADTO(Cliente c) {
        Ciudad ciudad = c.getCiudad();
        var depto = (ciudad != null) ? ciudad.getDepartamento() : null;
        var pais = (depto != null) ? depto.getPais() : null;

        return ClienteResponseDTO.builder()
            .id(c.getId())
            .tipoDocumentoId(c.getTipoDocumento().getId())
            .tipoDocumentoCodigo(c.getTipoDocumento().getCodigo())
            .tipoDocumentoNombre(c.getTipoDocumento().getNombre())
            .numeroDocumento(c.getNumeroDocumento())
            .nombres(c.getNombres())
            .apellidos(c.getApellidos())
            .nombreCompleto(c.getNombres() + " " + c.getApellidos())
            .fechaNacimiento(c.getFechaNacimiento())
            .direccion(c.getDireccion())
            .ciudadId(ciudad != null ? ciudad.getId() : null)
            .ciudadNombre(ciudad != null ? ciudad.getNombre() : null)
            .departamentoId(depto != null ? depto.getId() : null)
            .departamentoNombre(depto != null ? depto.getNombre() : null)
            .paisId(pais != null ? pais.getId() : null)
            .paisNombre(pais != null ? pais.getNombre() : null)
            .marcaId(c.getMarca().getId())
            .marcaNombre(c.getMarca().getNombre())
            .autorizaTratamientoDatos(c.getAutorizaTratamientoDatos())
            .fechaRegistro(c.getFechaRegistro())
            .build();
    }
}

