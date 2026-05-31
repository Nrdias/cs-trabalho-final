# Implementation Plan: Resource Allocation System (SARC)

**Branch**: `001-resource-allocation` | **Date**: 2026-05-31 | **Spec**: [spec.md](file:///Users/natandias/workspace/cs-trabalho-final/specs/001-resource-allocation/spec.md)

**Input**: Feature specification from `/specs/001-resource-allocation/spec.md`

## Summary

Build the Resource Allocation & Management System (SARC) based on a microservices architecture communicating via REST APIs. The solution includes a back-end structured with Spring Cloud components, Keycloak for authentication, a shared PostgreSQL database, and a decoupled frontend web application in Angular.

## Technical Context

**Language/Version**: Java 21 (back-end), TypeScript/Angular 17+ (front-end)

**Primary Dependencies**: 
- Spring Boot 3+, Spring Cloud Gateway, Netflix Eureka Server, Spring Cloud Config Server, Spring Security OAuth2/Resource Server, Spring Data JPA, Lombok.
- Angular CLI, RxJS, NgRx (optional, for state management), TailwindCSS (if requested, else vanilla CSS).

**Storage**: PostgreSQL (shared database per ADR-001)

**Testing**: JUnit 5, Mockito, Spring Boot Test, RestAssured (integration tests), Jasmine/Karma (Angular tests)

**Target Platform**: Docker Compose local development environment / OCI cloud deployment

**Project Type**: Multi-container microservices backend + Single Page Application (SPA) frontend

**Performance Goals**: Search queries returning under 1.5 seconds

**Constraints**: Clean Architecture for core business logic, SOLID code design, absolute prevention of double-booking in domain rules

**Scale/Scope**: 3 core user roles (Admin, Professor, Aluno), 15 defined User Stories (US01-US15)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: Clean Architecture**: Passed. Core domain services/entities will be pure Java packages within each microservice project, isolated from Spring Boot annotations where possible.
- **Principle II: SOLID & OOP**: Passed. Rich domain models will encapsulate status changes and validation, avoiding anemic structures.
- **Principle III: Clean Resource Allocation (FCFS)**: Passed. Overlap checks and booking validations will reside inside pure Java classes inside the `sarc-reservation-service` domain layer.
- **Principle IV: Test-Driven Domain Logic**: Passed. Domain modules will contain isolated unit tests with JUnit 5.
- **Principle V: Java 21 & Spring Boot Separation**: Passed. Leveraging records, pattern matching, and keeping Spring Boot configs in the adapter/infrastructure packages.

## Project Structure

### Documentation (this feature)

```text
specs/001-resource-allocation/
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
├── sarc-config-server/       # Spring Cloud Config
├── sarc-discovery-server/    # Netflix Eureka Discovery
├── sarc-gateway/             # Spring Cloud Gateway
├── sarc-user-service/        # microservice for USUARIO management
├── sarc-academic-service/    # microservice for TURMA, SEMESTRE management
├── sarc-resource-service/    # microservice for RECURSO management
└── sarc-reservation-service/ # microservice for RESERVA core engine
frontend/
└── sarc-web-angular/         # Angular SPA application
docker-compose.yml            # Multi-container orchestration
```

**Structure Decision**: Multi-project structure separating each microservice module and the Angular frontend application, coordinated by a root Docker Compose.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multi-microservice deployment | Mandated by software architecture document `arquitetura.md` | Single monolith would be simpler but violates microservices architecture requirement. |
| Shared Database (ADR-001) | Speed up development in initial phase | Independent databases would require distributed transaction patterns prematurely. |

## Verification Plan

### Automated Tests
- For microservices domain: Run `./mvnw test` in each microservice directory to run isolated unit tests.
- For integration APIs: Run integration tests with Testcontainers (PostgreSQL) or mock databases.
- For Angular application: Run `ng test` inside `frontend/sarc-web-angular`.

### Manual Verification
- Deploy the microservices and Angular client using `docker-compose up --build`.
- Run manual flows for Admin user (creating resource, creating teacher/student, creating class).
- Log in as Teacher, make a reservation for a class, and verify availability changes.
- Log in as Student and verify that only reservations for their class are visible.
