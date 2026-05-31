package com.sarc.reservation.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "RESERVA", schema = "sarc_reservation_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Long idReserva;

    @Column(name = "data_hora_inicio", nullable = false)
    private LocalDateTime dataHoraInicio;

    @Column(name = "data_hora_fim", nullable = false)
    private LocalDateTime dataHoraFim;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private StatusReserva status = StatusReserva.CONFIRMADA;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "id_professor", nullable = false)
    private Long idProfessor;

    @Column(name = "id_recurso", nullable = false)
    private Long idRecurso;

    @Column(name = "id_turma", nullable = false)
    private Long idTurma;

    public boolean overlapsWith(Reserva other) {
        if (this.status == StatusReserva.CANCELADA || other.status == StatusReserva.CANCELADA) {
            return false;
        }
        if (!this.idRecurso.equals(other.idRecurso)) {
            return false;
        }
        return this.dataHoraInicio.isBefore(other.dataHoraFim) && this.dataHoraFim.isAfter(other.dataHoraInicio);
    }
}
