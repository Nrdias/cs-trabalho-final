package com.sarc.academic.adapters;

import com.sarc.academic.domain.Semestre;
import com.sarc.academic.domain.SemestreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/semestres")
public class SemestreController {

    private final SemestreRepository semestreRepository;

    @Autowired
    public SemestreController(SemestreRepository semestreRepository) {
        this.semestreRepository = semestreRepository;
    }

    @PostMapping
    public ResponseEntity<Semestre> criarSemestre(@RequestBody Semestre semestre) {
        // If this semester is active, disable other active semesters to keep consistency
        if (semestre.getAtivo()) {
            semestreRepository.findByAtivoTrue().ifPresent(active -> {
                active.setAtivo(false);
                semestreRepository.save(active);
            });
        }
        Semestre novo = semestreRepository.save(semestre);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @GetMapping
    public ResponseEntity<List<Semestre>> listarSemestres() {
        return ResponseEntity.ok(semestreRepository.findAll());
    }

    @GetMapping("/ativo")
    public ResponseEntity<Semestre> obterSemestreAtivo() {
        return semestreRepository.findByAtivoTrue()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
