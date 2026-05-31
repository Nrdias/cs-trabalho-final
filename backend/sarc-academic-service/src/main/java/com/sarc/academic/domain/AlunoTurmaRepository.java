package com.sarc.academic.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlunoTurmaRepository extends JpaRepository<AlunoTurma, AlunoTurmaId> {
    List<AlunoTurma> findByIdAluno(Long idAluno);
    List<AlunoTurma> findByIdTurma(Long idTurma);
    void deleteByIdTurma(Long idTurma);
}
