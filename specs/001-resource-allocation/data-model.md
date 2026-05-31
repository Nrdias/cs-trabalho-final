# Data Model: SARC Database Schemas

Based on the database specification in `banco de dados.pdf`, here are the PostgreSQL definitions, constraints, and relationships.

## PostgreSQL Schemas and Tables

### 1. Schema: `sarc_user_schema` (Managed by `sarc-user-service`)

#### Table: `USUARIO`
- `id_usuario` SERIAL (PK)
- `nome` VARCHAR(120) NOT NULL
- `email` VARCHAR(150) NOT NULL UNIQUE
- `senha_hash` VARCHAR(255) NOT NULL
- `matricula_cpf` VARCHAR(20) NOT NULL UNIQUE
- `tipo` VARCHAR(20) NOT NULL (Values: 'ADMIN', 'PROFESSOR', 'ALUNO')
- `ativo` BOOLEAN NOT NULL DEFAULT TRUE

---

### 2. Schema: `sarc_resource_schema` (Managed by `sarc-resource-service`)

#### Table: `RECURSO`
- `id_recurso` SERIAL (PK)
- `nome` VARCHAR(100) NOT NULL
- `localizacao` VARCHAR(150) NOT NULL
- `descricao` TEXT
- `tipo` VARCHAR(20) NOT NULL (Values: 'LABORATORIO', 'EQUIPAMENTO')
- `status` VARCHAR(20) NOT NULL DEFAULT 'ATIVO' (Values: 'ATIVO', 'INATIVO')

---

### 3. Schema: `sarc_academic_schema` (Managed by `sarc-academic-service`)

#### Table: `SEMESTRE`
- `id_semestre` SERIAL (PK)
- `descricao` VARCHAR(50) NOT NULL
- `data_inicio` DATE NOT NULL
- `data_fim` DATE NOT NULL
- `ativo` BOOLEAN NOT NULL DEFAULT TRUE

#### Table: `TURMA`
- `id_turma` SERIAL (PK)
- `codigo` VARCHAR(30) NOT NULL UNIQUE
- `nome` VARCHAR(120) NOT NULL
- `periodo_letivo` VARCHAR(30) NOT NULL
- `id_semestre` INT NOT NULL (FK to `SEMESTRE.id_semestre`)
- `id_professor` INT NOT NULL (FK to `sarc_user_schema.USUARIO.id_usuario` via logical relation)

#### Table: `ALUNO_TURMA` (Associative table for student enrollment, N:N relationship)
- `id_aluno` INT NOT NULL (FK to `sarc_user_schema.USUARIO.id_usuario` via logical relation)
- `id_turma` INT NOT NULL (FK to `TURMA.id_turma` on delete cascade)
- Primary Key: (`id_aluno`, `id_turma`)

---

### 4. Schema: `sarc_reservation_schema` (Managed by `sarc-reservation-service`)

#### Table: `RESERVA`
- `id_reserva` SERIAL (PK)
- `data_hora_inicio` TIMESTAMP NOT NULL
- `data_hora_fim` TIMESTAMP NOT NULL
- `status` VARCHAR(20) NOT NULL DEFAULT 'CONFIRMADA' (Values: 'CONFIRMADA', 'CANCELADA')
- `observacao` TEXT
- `id_professor` INT NOT NULL (FK to `sarc_user_schema.USUARIO.id_usuario` via logical relation)
- `id_recurso` INT NOT NULL (FK to `sarc_resource_schema.RECURSO.id_recurso` via logical relation)
- `id_turma` INT NOT NULL (FK to `sarc_academic_schema.TURMA.id_turma` via logical relation)

## Constraints & Integrity Rules

1. **Scheduling Conflict Constraint (No Double-Booking)**:
   Any new `RESERVA` row must not overlap with an existing reservation for the same resource:
   ```sql
   -- Conceptual constraint query checked by application/database before inserting:
   SELECT COUNT(*) FROM RESERVA
   WHERE id_recurso = :id_recurso
     AND status = 'CONFIRMADA'
     AND data_hora_inicio < :data_hora_fim
     AND data_hora_fim > :data_hora_inicio;
   ```
   To enforce this at the database engine level (PostgreSQL), we can use an exclusion constraint:
   ```sql
   CREATE EXTENSION IF NOT EXISTS btree_gist;
   
   ALTER TABLE RESERVA ADD CONSTRAINT no_overlap_booking
   EXCLUDE USING gist (
     id_recurso WITH =,
     tsrange(data_hora_inicio, data_hora_fim) WITH &&
   ) WHERE (status = 'CONFIRMADA');
   ```

2. **No Deletion with Active Bookings**:
   - `RECURSO` cannot be deleted if there is a `RESERVA` with `id_recurso` and `status = 'CONFIRMADA'` where `data_hora_fim > NOW()`.
