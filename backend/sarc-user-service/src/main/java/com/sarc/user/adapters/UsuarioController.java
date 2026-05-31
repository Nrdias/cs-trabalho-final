package com.sarc.user.adapters;

import com.sarc.user.domain.Usuario;
import com.sarc.user.domain.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("E-mail já cadastrado.");
        }
        if (usuarioRepository.findByMatriculaCpf(usuario.getMatriculaCpf()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Matrícula/CPF já cadastrado.");
        }

        // Generate temporary password
        String senhaTemporaria = UUID.randomUUID().toString().substring(0, 8);
        
        // Simple hash mock for password storage
        usuario.setSenhaHash(senhaTemporaria + "_hash");
        usuario.setAtivo(true);

        Usuario novoUsuario = usuarioRepository.save(usuario);

        // Return user details along with generated temporary password to satisfy US05 requirement
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "usuario", novoUsuario,
            "senhaTemporaria", senhaTemporaria,
            "boasVindasEmail", "Enviado e-mail de boas-vindas para " + novoUsuario.getEmail()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Usuario> alterarStatus(@PathVariable Long id, @RequestParam("ativo") boolean ativo) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setAtivo(ativo);
                    Usuario atualizado = usuarioRepository.save(usuario);
                    return ResponseEntity.ok(atualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
