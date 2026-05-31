package com.sarc.academic.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ALUNO_TURMA", schema = "sarc_academic_schema")
@IdClass(AlunoTurmaId.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlunoTurma {

    @Id
    @Column(name = "id_aluno")
    private Long idAluno;

    @Id
    @Column(name = "id_turma")
    private Long idTurma;
}
