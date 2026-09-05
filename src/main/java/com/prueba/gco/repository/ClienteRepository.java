package com.prueba.gco.repository;

import com.prueba.gco.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    /**
     * Valida si ya existe un cliente con el mismo documento para esa marca específica
     */
    boolean existsByTipoDocumentoIdAndNumeroDocumentoAndMarcaId(
        Long tipoDocumentoId,
        String numeroDocumento,
        Long marcaId
    );

    Optional<Cliente> findByTipoDocumentoIdAndNumeroDocumentoAndMarcaId(
        Long tipoDocumentoId,
        String numeroDocumento,
        Long marcaId
    );

    List<Cliente> findByMarcaId(Long marcaId);
}

