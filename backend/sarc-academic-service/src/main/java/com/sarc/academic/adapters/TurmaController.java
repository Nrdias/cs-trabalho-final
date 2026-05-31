package com.sarc.academic.adapters;

import com.sarc.academic.domain.Turma;
import com.sarc.academic.domain.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/turmas")
public class TurmaController {

    private final TurmaRepository turmaRepository;

    @Autowired
    public TurmaController(TurmaRepository turmaRepository) {
        this.turmaRepository = turmaRepository;
    }

    @PostMapping
    public ResponseEntity<Turma> criarTurma(@RequestBody Turma turma) {
        if (turmaRepository.findByCodigo(turma.getCodigo()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        Turma nova = turmaRepository.save(turma);
        return ResponseEntity.status(HttpStatus.CREATED).body(nova);
    }

    @GetMapping
    public ResponseEntity<List<Turma>> listarTodas() {
        return ResponseEntity.ok(turmaRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Turma> obterPorId(@PathVariable Long id) {
        return turmaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/professor/{idProfessor}")
    public ResponseEntity<List<Turma>> listarPorProfessor(@PathVariable Long idProfessor) {
        return ResponseEntity.ok(turmaRepository.findByIdProfessor(idProfessor));
    }
}
