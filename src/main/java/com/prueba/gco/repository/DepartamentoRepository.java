package com.prueba.gco.repository;

import com.prueba.gco.model.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {

    List<Departamento> findByPaisId(Long paisId);
}

