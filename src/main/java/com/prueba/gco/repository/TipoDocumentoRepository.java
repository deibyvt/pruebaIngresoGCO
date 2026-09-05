package com.prueba.gco.repository;

import com.prueba.gco.model.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TipoDocumentoRepository extends JpaRepository<TipoDocumento, Long> {

    // Retorna solo los tipos de documento activos para mostrarlos en el select del frontend
    List<TipoDocumento> findByActivoTrue();

    Optional<TipoDocumento> findByCodigo(String codigo);
}

