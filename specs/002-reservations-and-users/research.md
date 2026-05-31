# Research Report: Reservations and Users Management

This document outlines the technical research, design decisions, and patterns selected to implement the user and reservation management capabilities in SARC.

## Decision 1: Authentication & Authorization via Keycloak

- **Decision**: Integrate Keycloak token validation (JWT) in all microservices via `Spring Security OAuth2 Resource Server`.
- **Rationale**: Keeps user credentials outside application logic, implements standardized OAuth2/OIDC flows, and maps roles (`ADMIN`, `PROFESSOR`, `ALUNO`) to secure endpoints.
- **Alternatives Considered**: Session-based cookie auth (rejected due to distributed microservices nature).

## Decision 2: Prevention of Booking Conflicts (FCFS Rule)

- **Decision**: Validate resource availability in `sarc-reservation-service` utilizing database-level transaction isolation and JPQL overlap queries.
- **Rationale**: Pure domain-level validation checks date range overlaps. The PostgreSQL database acts as the single source of truth using a logical conflict check query before persistence.
- **Alternatives Considered**: Database-level postgres exclusion constraints (rejected because it limits DB-agnostic code portability, though a query-level check is highly portable).

## Decision 3: Academic Semesters Management

- **Decision**: Relate all class enrollments and reservations to the `SEMESTRE` entity, default-filtering queries in the student and teacher view by `ativo = true`.
- **Rationale**: Simplifies the queries, reduces cognitive load, and matches standard academic schedules.
