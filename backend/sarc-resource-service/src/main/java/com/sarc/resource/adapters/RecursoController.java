package com.sarc.resource.adapters;

import com.sarc.resource.domain.Recurso;
import com.sarc.resource.domain.RecursoRepository;
import com.sarc.resource.domain.StatusRecurso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recursos")
public class RecursoController {

    private final RecursoRepository recursoRepository;
    private final com.sarc.resource.domain.RecursoValidator recursoValidator;

    @Autowired
    public RecursoController(RecursoRepository recursoRepository, com.sarc.resource.domain.RecursoValidator recursoValidator) {
        this.recursoRepository = recursoRepository;
        this.recursoValidator = recursoValidator;
    }

    @PostMapping
    public ResponseEntity<Recurso> cadastrarRecurso(@RequestBody Recurso recurso) {
        if (recurso.getIdRecurso() != null && recursoRepository.existsById(recurso.getIdRecurso())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        Recurso novoRecurso = recursoRepository.save(recurso);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoRecurso);
    }

    @GetMapping
    public ResponseEntity<List<Recurso>> listarRecursosAtivos() {
        List<Recurso> ativos = recursoRepository.findByStatus(StatusRecurso.ATIVO);
        return ResponseEntity.ok(ativos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recurso> buscarPorId(@PathVariable Long id) {
        return recursoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recurso> atualizarRecurso(@PathVariable Long id, @RequestBody Recurso recursoAtualizado) {
        return recursoRepository.findById(id)
                .map(recurso -> {
                    recurso.setNome(recursoAtualizado.getNome());
                    recurso.setLocalizacao(recursoAtualizado.getLocalizacao());
                    recurso.setDescricao(recursoAtualizado.getDescricao());
                    recurso.setTipo(recursoAtualizado.getTipo());
                    recurso.setStatus(recursoAtualizado.getStatus());
                    Recurso salvo = recursoRepository.save(recurso);
                    return ResponseEntity.ok(salvo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerRecurso(@PathVariable Long id) {
        if (!recursoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        if (recursoValidator.hasActiveReservations(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Return 409 conflict
        }
        recursoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
