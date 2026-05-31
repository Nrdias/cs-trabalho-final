package com.sarc.academic.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {
    Optional<Turma> findByCodigo(String codigo);
    List<Turma> findByIdProfessor(Long idProfessor);
    List<Turma> findByIdSemestre(Long idSemestre);
}
