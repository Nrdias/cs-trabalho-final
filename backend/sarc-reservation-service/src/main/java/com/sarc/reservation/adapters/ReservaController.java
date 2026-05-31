package com.sarc.reservation.adapters;

import com.sarc.reservation.domain.Reserva;
import com.sarc.reservation.domain.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDateTime;
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

    @GetMapping("/professor")
    public ResponseEntity<List<Reserva>> obterReservasProfessor(
            @RequestParam("idProfessor") Long idProfessor,
            @RequestParam(value = "dataInicio", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(value = "dataFim", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        
        List<Reserva> reservas = reservaRepository.findByIdProfessor(idProfessor);
        
        // Simple logic filter
        if (dataInicio != null && dataFim != null) {
            reservas = reservas.stream()
                .filter(r -> !r.getDataHoraInicio().isBefore(dataInicio) && !r.getDataHoraFim().isAfter(dataFim))
                .toList();
        }
        
        return ResponseEntity.ok(reservas);
    }


    @GetMapping("/classes")
    public ResponseEntity<List<Reserva>> obterReservasClasses(@RequestParam("idTurmas") List<Long> idTurmas) {
        if (idTurmas == null || idTurmas.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        List<Reserva> res = reservaRepository.findAll().stream()
                .filter(r -> idTurmas.contains(r.getIdTurma()))
                .toList();
        return ResponseEntity.ok(res);
    }


    @PostMapping
    public ResponseEntity<?> criarReserva(@RequestBody Reserva reserva) {
        if (reserva.getDataHoraInicio() == null || reserva.getDataHoraFim() == null) {
            return ResponseEntity.badRequest().body("Datas de início e fim são obrigatórias.");
        }
        if (!reserva.getDataHoraFim().isAfter(reserva.getDataHoraInicio())) {
            return ResponseEntity.badRequest().body("A data de término deve ser após a data de início.");
        }
        
        // FCFS rule validation: Check overlap
        boolean overlap = reservaRepository.hasOverlap(
                reserva.getIdRecurso(),
                reserva.getDataHoraInicio(),
                reserva.getDataHoraFim(),
                reserva.getIdReserva()
        );
        
        if (overlap) {
            return ResponseEntity.status(409).body("Conflito de horários: Este recurso já está reservado neste período.");
        }
        
        Reserva nova = reservaRepository.save(reserva);
        return ResponseEntity.status(201).body(nova);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarReserva(@PathVariable("id") Long id, @RequestParam("idProfessor") Long idProfessor) {
        return reservaRepository.findById(id)
                .map(reserva -> {
                    if (!reserva.getIdProfessor().equals(idProfessor)) {
                        return ResponseEntity.status(403).body("Apenas o professor proprietário da reserva pode cancelá-la.");
                    }
                    reserva.setStatus(com.sarc.reservation.domain.StatusReserva.CANCELADA);
                    reservaRepository.save(reserva);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}


