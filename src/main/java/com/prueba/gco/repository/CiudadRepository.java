package com.prueba.gco.repository;

import com.prueba.gco.model.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CiudadRepository extends JpaRepository<Ciudad, Long> {

    // Permite cargar únicamente las ciudades del departamento seleccionado (filtro en cascada)
    List<Ciudad> findByDepartamentoId(Long departamentoId);
}

