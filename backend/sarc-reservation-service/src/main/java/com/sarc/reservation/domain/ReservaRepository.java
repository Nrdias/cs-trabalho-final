package com.sarc.reservation.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByIdProfessor(Long idProfessor);

    List<Reserva> findByIdRecurso(Long idRecurso);

    List<Reserva> findByIdTurma(Long idTurma);

    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.idRecurso = :idRecurso AND r.status = 'CONFIRMADA' AND r.dataHoraFim > CURRENT_TIMESTAMP")
    boolean existsActiveReservationsForResource(@Param("idRecurso") Long idRecurso);
}
