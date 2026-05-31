CREATE SCHEMA IF NOT EXISTS sarc_user_schema;
CREATE SCHEMA IF NOT EXISTS sarc_academic_schema;
CREATE SCHEMA IF NOT EXISTS sarc_resource_schema;
CREATE SCHEMA IF NOT EXISTS sarc_reservation_schema;

-- Enable btree_gist extension for exclusion constraint (overlap detection)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. Table: USUARIO
CREATE TABLE IF NOT EXISTS sarc_user_schema.usuario (
    id_usuario BIGSERIAL PRIMARY KEY,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    matricula_cpf VARCHAR(20) NOT NULL UNIQUE,
    nome VARCHAR(120) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL
);

-- 2. Table: SEMESTRE
CREATE TABLE IF NOT EXISTS sarc_academic_schema.semestre (
    id_semestre BIGSERIAL PRIMARY KEY,
    ativo BOOLEAN NOT NULL,
    data_fim DATE NOT NULL,
    data_inicio DATE NOT NULL,
    descricao VARCHAR(50) NOT NULL
);

-- 3. Table: TURMA
CREATE TABLE IF NOT EXISTS sarc_academic_schema.turma (
    id_turma BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    id_professor BIGINT NOT NULL,
    id_semestre BIGINT NOT NULL,
    nome VARCHAR(120) NOT NULL,
    periodo_letivo VARCHAR(30) NOT NULL
);

-- 4. Table: ALUNO_TURMA
CREATE TABLE IF NOT EXISTS sarc_academic_schema.aluno_turma (
    id_aluno BIGINT NOT NULL,
    id_turma BIGINT NOT NULL,
    PRIMARY KEY (id_aluno, id_turma)
);

-- 5. Table: RECURSO
CREATE TABLE IF NOT EXISTS sarc_resource_schema.recurso (
    id_recurso BIGSERIAL PRIMARY KEY,
    descricao TEXT,
    localizacao VARCHAR(150) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    tipo VARCHAR(20) NOT NULL
);

-- 6. Table: RESERVA
CREATE TABLE IF NOT EXISTS sarc_reservation_schema.reserva (
    id_reserva BIGSERIAL PRIMARY KEY,
    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMADA',
    observacao TEXT,
    id_professor BIGINT NOT NULL,
    id_recurso BIGINT NOT NULL,
    id_turma BIGINT NOT NULL,
    CONSTRAINT chk_dates CHECK (data_hora_fim > data_hora_inicio),
    CONSTRAINT exclude_overlapping_reservations EXCLUDE USING gist (
        id_recurso WITH =,
        tsrange(data_hora_inicio, data_hora_fim) WITH &&
    ) WHERE (status = 'CONFIRMADA')
);

-- ==========================================
-- SEED DATA
-- ==========================================

-- Insert Users (matching Keycloak usernames)
INSERT INTO sarc_user_schema.usuario (id_usuario, ativo, email, matricula_cpf, nome, senha_hash, tipo) VALUES
(1, true, 'natan.admin', 'MC-natan.admin', 'Natan Admin', 'auto_generated', 'ADMIN'),
(2, true, 'natan.prof', 'MC-natan.prof', 'Natan Professor', 'auto_generated', 'PROFESSOR'),
(3, true, 'natan', 'MC-natan', 'Natan Aluno', 'auto_generated', 'ALUNO'),
(4, true, 'prof.silva', 'MC-prof.silva', 'Professor Silva', 'auto_generated', 'PROFESSOR')
ON CONFLICT (id_usuario) DO UPDATE SET
    email = EXCLUDED.email,
    nome = EXCLUDED.nome,
    tipo = EXCLUDED.tipo;

-- Insert Semesters
INSERT INTO sarc_academic_schema.semestre (id_semestre, ativo, data_fim, data_inicio, descricao) VALUES
(1, true, '2026-07-15', '2026-03-01', '2026/1')
ON CONFLICT (id_semestre) DO UPDATE SET
    ativo = EXCLUDED.ativo,
    descricao = EXCLUDED.descricao;

-- Insert Resources
INSERT INTO sarc_resource_schema.recurso (id_recurso, nome, localizacao, descricao, tipo, status) VALUES
(1, 'lab 204', 'predio 32, sala 204', 'Laboratório principal de informática', 'LABORATORIO', 'ATIVO'),
(2, 'Projetor EPSON', 'Armário Central', 'Projetor portátil HDMI', 'EQUIPAMENTO', 'ATIVO')
ON CONFLICT (id_recurso) DO UPDATE SET
    nome = EXCLUDED.nome,
    localizacao = EXCLUDED.localizacao;

-- Insert Turmas
INSERT INTO sarc_academic_schema.turma (id_turma, codigo, id_professor, id_semestre, nome, periodo_letivo) VALUES
(1, 'ENG-302', 2, 1, 'Engenharia de Software', '2026/1'),
(2, 'QMC-101', 4, 1, 'Química Geral', '2026/1')
ON CONFLICT (id_turma) DO UPDATE SET
    codigo = EXCLUDED.codigo,
    id_professor = EXCLUDED.id_professor;

-- Enroll Student natan (ID 3) into ENG-302 (ID 1) and QMC-101 (ID 2)
INSERT INTO sarc_academic_schema.aluno_turma (id_aluno, id_turma) VALUES
(3, 1),
(3, 2)
ON CONFLICT DO NOTHING;
