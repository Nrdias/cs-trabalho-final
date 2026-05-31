package com.sarc.reservation.domain;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

public class ReservaTest {

    @Test
    public void testNoOverlapDifferentResources() {
        Reserva r1 = Reserva.builder()
                .idReserva(1L)
                .idRecurso(1L)
                .dataHoraInicio(LocalDateTime.of(2026, 6, 1, 10, 0))
                .dataHoraFim(LocalDateTime.of(2026, 6, 1, 12, 0))
                .status(StatusReserva.CONFIRMADA)
                .build();

        Reserva r2 = Reserva.builder()
                .idReserva(2L)
                .idRecurso(2L)
                .dataHoraInicio(LocalDateTime.of(2026, 6, 1, 11, 0))
                .dataHoraFim(LocalDateTime.of(2026, 6, 1, 13, 0))
                .status(StatusReserva.CONFIRMADA)
                .build();

        assertFalse(r1.overlapsWith(r2));
        assertFalse(r2.overlapsWith(r1));
    }

    @Test
    public void testNoOverlapSequencedTimes() {
        Reserva r1 = Reserva.builder()
                .idReserva(1L)
                .idRecurso(1L)
                .dataHoraInicio(LocalDateTime.of(2026, 6, 1, 10, 0))
                .dataHoraFim(LocalDateTime.of(2026, 6, 1, 12, 0))
                .status(StatusReserva.CONFIRMADA)
                .build();

        Reserva r2 = Reserva.builder()
                .idReserva(2L)
                .idRecurso(1L)
                .dataHoraInicio(LocalDateTime.of(2026, 6, 1, 12, 0))
                .dataHoraFim(LocalDateTime.of(2026, 6, 1, 14, 0))
                .status(StatusReserva.CONFIRMADA)
                .build();

        assertFalse(r1.overlapsWith(r2));
        assertFalse(r2.overlapsWith(r1));
    }

    @Test
    public void testOverlapPartialIntersection() {
        Reserva r1 = Reserva.builder()
                .idReserva(1L)
                .idRecurso(1L)
                .dataHoraInicio(LocalDateTime.of(2026, 6, 1, 10, 0))
                .dataHoraFim(LocalDateTime.of(2026, 6, 1, 12, 0))
                .status(StatusReserva.CONFIRMADA)
                .build();

        Reserva r2 = Reserva.builder()
                .idReserva(2L)
                .idRecurso(1L)
                .dataHoraInicio(LocalDateTime.of(2026, 6, 1, 11, 0))
                .dataHoraFim(LocalDateTime.of(2026, 6, 1, 13, 0))
                .status(StatusReserva.CONFIRMADA)
                .build();

        assertTrue(r1.overlapsWith(r2));
        assertTrue(r2.overlapsWith(r1));
    }

    @Test
    public void testOverlapCompletelyInside() {
        Reserva r1 = Reserva.builder()
                .idReserva(1L)
                .idRecurso(1L)
                .dataHoraInicio(LocalDateTime.of(2026, 6, 1, 10, 0))
                .dataHoraFim(LocalDateTime.of(2026, 6, 1, 13, 0))
                .status(StatusReserva.CONFIRMADA)
                .build();

        Reserva r2 = Reserva.builder()
                .idReserva(2L)
                .idRecurso(1L)
                .dataHoraInicio(LocalDateTime.of(2026, 6, 1, 11, 0))
                .dataHoraFim(LocalDateTime.of(2026, 6, 1, 12, 0))
                .status(StatusReserva.CONFIRMADA)
                .build();

        assertTrue(r1.overlapsWith(r2));
        assertTrue(r2.overlapsWith(r1));
    }

    @Test
    public void testNoOverlapCanceledBooking() {
        Reserva r1 = Reserva.builder()
                .idReserva(1L)
                .idRecurso(1L)
                .dataHoraInicio(LocalDateTime.of(2026, 6, 1, 10, 0))
                .dataHoraFim(LocalDateTime.of(2026, 6, 1, 12, 0))
                .status(StatusReserva.CANCELADA)
                .build();

        Reserva r2 = Reserva.builder()
                .idReserva(2L)
                .idRecurso(1L)
                .dataHoraInicio(LocalDateTime.of(2026, 6, 1, 11, 0))
                .dataHoraFim(LocalDateTime.of(2026, 6, 1, 13, 0))
                .status(StatusReserva.CONFIRMADA)
                .build();

        assertFalse(r1.overlapsWith(r2));
        assertFalse(r2.overlapsWith(r1));
    }
}
