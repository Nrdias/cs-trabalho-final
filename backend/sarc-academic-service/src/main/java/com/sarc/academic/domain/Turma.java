package com.sarc.academic.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "TURMA", schema = "sarc_academic_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_turma")
    private Long idTurma;

    @Column(name = "codigo", length = 30, nullable = false, unique = true)
    private String codigo;

    @Column(name = "nome", length = 120, nullable = false)
    private String nome;

    @Column(name = "periodo_letivo", length = 30, nullable = false)
    private String periodoLetivo;

    @Column(name = "id_semestre", nullable = false)
    private Long idSemestre;

    @Column(name = "id_professor", nullable = false)
    private Long idProfessor;
}
