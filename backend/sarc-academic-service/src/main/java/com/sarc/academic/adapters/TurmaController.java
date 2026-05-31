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
    private final com.sarc.academic.domain.AlunoTurmaRepository alunoTurmaRepository;

    @Autowired
    public TurmaController(TurmaRepository turmaRepository, com.sarc.academic.domain.AlunoTurmaRepository alunoTurmaRepository) {
        this.turmaRepository = turmaRepository;
        this.alunoTurmaRepository = alunoTurmaRepository;
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

    @PutMapping("/{id}/professores")
    public ResponseEntity<Turma> vincularProfessor(@PathVariable Long id, @RequestParam("idProfessor") Long idProfessor) {
        return turmaRepository.findById(id)
                .map(turma -> {
                    turma.setIdProfessor(idProfessor);
                    Turma salva = turmaRepository.save(turma);
                    return ResponseEntity.ok(salva);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/alunos")
    public ResponseEntity<Void> vincularAlunos(@PathVariable Long id, @RequestBody List<Long> idsAlunos) {
        if (!turmaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        idsAlunos.forEach(idAluno -> {
            com.sarc.academic.domain.AlunoTurma relation = com.sarc.academic.domain.AlunoTurma.builder()
                    .idAluno(idAluno)
                    .idTurma(id)
                    .build();
            alunoTurmaRepository.save(relation);
        });
        return ResponseEntity.ok().build();
    }

    @GetMapping("/aluno/{idAluno}")
    public ResponseEntity<List<Turma>> listarPorAluno(@PathVariable Long idAluno) {
        List<Long> idsTurmas = alunoTurmaRepository.findByIdAluno(idAluno).stream()
                .map(com.sarc.academic.domain.AlunoTurma::getIdTurma)
                .toList();
        List<Turma> turmas = turmaRepository.findAllById(idsTurmas);
        return ResponseEntity.ok(turmas);
    }
}
