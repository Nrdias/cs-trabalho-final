# Implementation Plan: Reservations and Users Management

**Branch**: `002-reservations-and-users` | **Date**: 2026-05-31 | **Spec**: [spec.md](file:///Users/natandias/workspace/cs-trabalho-final/specs/002-reservations-and-users/spec.md)

**Input**: Feature specification from `/specs/002-reservations-and-users/spec.md`

## Summary

Complete the implementation of the SARC academic reservation features. This includes integrating Keycloak authentication and validating/filtering reservations for Admin, Professor, and Aluno profiles in the frontend React client and the backend microservices.

## Technical Context

**Language/Version**: Java 21 (back-end), TypeScript/React 18 (front-end)

**Primary Dependencies**: 
- Spring Boot 3+, Spring Cloud components (Gateway, Config, Discovery), Spring Security OAuth2, Keycloak Resource Server, Spring Data JPA.
- React.js, Vite, Keycloak JS SDK.

**Storage**: PostgreSQL (shared database instance `sarc_db`)

**Testing**: JUnit 5, Mockito, Spring Boot Integration Tests (JUnit/REST-Assured)

**Target Platform**: Local development using Dev Container and Docker Compose

**Project Type**: Decoupled multi-microservice backend + SPA React frontend

**Performance Goals**: API response times < 1.5s for reservations search and filters

**Constraints**: Clean Architecture for core logic, strict FCFS booking validations in domain entities

**Scale/Scope**: Remaining user stories (US03 to US15) including roles mapping, dashboard integrations, and classes scheduling.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: Clean Architecture & Separation of Concerns (NON-NEGOTIABLE)**: Passed. Core logic for reservation matching, capacity checks, and academic period rules are implemented in pure Java domain layers, isolated from Spring Boot.
- **Principle II: Strict Object-Oriented Design & SOLID (NON-NEGOTIABLE)**: Passed. Domain objects like `Reserva`, `Usuario`, and `Turma` encapsulate validation behaviors and business operations.
- **Principle III: Clean Resource Allocation & Scheduling Integrity (NON-NEGOTIABLE)**: Passed. The FCFS checking logic and date-range overlap verification reside strictly in the `Reserva` domain level.
- **Principle IV: Test-Driven Domain-Logic Verification**: Passed. Units tests verify scheduling conflict detection in isolation.
- **Principle V: Java 21 LTS & Spring Boot Architecture Separation**: Passed. Record types are utilized for DTOs and external integrations, with Spring annotations restricted to outer adapter modules.

## Project Structure

### Documentation (this feature)

```text
specs/002-reservations-and-users/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
backend/
├── sarc-config-server/
├── sarc-discovery-server/
├── sarc-gateway/
├── sarc-user-service/
├── sarc-academic-service/
├── sarc-resource-service/
└── sarc-reservation-service/

frontend/
└── sarc-web-react/
```

**Structure Decision**: Multi-service Spring Boot backend communicating via REST API, coupled with a React SPA client using Keycloak OAuth2 auth provider.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multi-microservice deployment | Matches project architecture constraints | A monolith would require rebuilding the infrastructure which is already complete. |
