package com.sarc.academic.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "SEMESTRE", schema = "sarc_academic_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Semestre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_semestre")
    private Long idSemestre;

    @Column(name = "descricao", length = 50, nullable = false)
    private String descricao;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDate dataFim;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;
}
