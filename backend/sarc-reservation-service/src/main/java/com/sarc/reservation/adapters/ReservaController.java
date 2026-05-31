package com.sarc.reservation.adapters;

import com.sarc.reservation.domain.Reserva;
import com.sarc.reservation.domain.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reservas")
public class ReservaController {

    private final ReservaRepository reservaRepository;

    @Autowired
    public ReservaController(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    @GetMapping("/check-active")
    public ResponseEntity<Boolean> checkActiveReservationsForResource(@RequestParam("idRecurso") Long idRecurso) {
        boolean hasActive = reservaRepository.existsActiveReservationsForResource(idRecurso);
        return ResponseEntity.ok(hasActive);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Reserva>> obterTodasReservas(
            @RequestParam(value = "idRecurso", required = false) Long idRecurso,
            @RequestParam(value = "idProfessor", required = false) Long idProfessor,
            @RequestParam(value = "idTurma", required = false) Long idTurma) {
        
        if (idRecurso != null) {
            return ResponseEntity.ok(reservaRepository.findByIdRecurso(idRecurso));
        }
        if (idProfessor != null) {
            return ResponseEntity.ok(reservaRepository.findByIdProfessor(idProfessor));
        }
        if (idTurma != null) {
            return ResponseEntity.ok(reservaRepository.findByIdTurma(idTurma));
        }
        return ResponseEntity.ok(reservaRepository.findAll());
    }
}
