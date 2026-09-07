package com.prueba.gco.repository;

import com.prueba.gco.model.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarcaRepository extends JpaRepository<Marca, Long> {

    List<Marca> findByActivoTrue();

    Optional<Marca> findByCodigo(String codigo);
}

