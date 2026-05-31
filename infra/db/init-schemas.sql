CREATE SCHEMA IF NOT EXISTS sarc_user_schema;
CREATE SCHEMA IF NOT EXISTS sarc_academic_schema;
CREATE SCHEMA IF NOT EXISTS sarc_resource_schema;
CREATE SCHEMA IF NOT EXISTS sarc_reservation_schema;

-- Enable btree_gist extension for exclusion constraint (overlap detection)
CREATE EXTENSION IF NOT EXISTS btree_gist;

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
    
    -- FCFS constraint: No overlapping confirmed bookings on the same resource
    CONSTRAINT exclude_overlapping_reservations EXCLUDE USING gist (
        id_recurso WITH =,
        tsrange(data_hora_inicio, data_hora_fim) WITH &&
    ) WHERE (status = 'CONFIRMADA')
);
