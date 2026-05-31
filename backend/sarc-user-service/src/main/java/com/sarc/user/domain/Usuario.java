package com.sarc.user.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "USUARIO", schema = "sarc_user_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "nome", length = 120, nullable = false)
    private String nome;

    @Column(name = "email", length = 150, nullable = false, unique = true)
    private String email;

    @Column(name = "senha_hash", length = 255, nullable = false)
    private String senhaHash;

    @Column(name = "matricula_cpf", length = 20, nullable = false, unique = true)
    private String matriculaCpf;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", length = 20, nullable = false)
    private PerfilUsuario tipo;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;
}
