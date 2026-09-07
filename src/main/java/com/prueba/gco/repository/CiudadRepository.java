package com.prueba.gco.repository;

import com.prueba.gco.model.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CiudadRepository extends JpaRepository<Ciudad, Long> {

    List<Ciudad> findByDepartamentoId(Long departamentoId);
}

