package com.sarc.academic.domain;

import java.io.Serializable;
import java.util.Objects;

public class AlunoTurmaId implements Serializable {

    private Long idAluno;
    private Long idTurma;

    public AlunoTurmaId() {}

    public AlunoTurmaId(Long idAluno, Long idTurma) {
        this.idAluno = idAluno;
        this.idTurma = idTurma;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AlunoTurmaId that = (AlunoTurmaId) o;
        return Objects.equals(idAluno, that.idAluno) && Objects.equals(idTurma, that.idTurma);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idAluno, idTurma);
    }
}
