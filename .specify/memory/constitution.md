<!--
Sync Impact Report:
- Version change: v0.0.0 -> v1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> Princípio I: Clean Architecture & Separation of Concerns (NON-NEGOTIABLE)
  - [PRINCIPLE_2_NAME] -> Princípio II: Strict Object-Oriented Design & SOLID (NON-NEGOTIABLE)
  - [PRINCIPLE_3_NAME] -> Princípio III: Clean Resource Allocation & Scheduling Integrity (NON-NEGOTIABLE)
  - [PRINCIPLE_4_NAME] -> Princípio IV: Test-Driven Domain-Logic Verification
  - [PRINCIPLE_5_NAME] -> Princípio V: Java 21 LTS & Spring Boot Architecture Separation
- Added sections:
  - Architectural & Technical Constraints
  - Development & Verification Workflow
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ aligned)
  - .specify/templates/spec-template.md (✅ aligned)
  - .specify/templates/tasks-template.md (✅ aligned)
- Follow-up TODOs: None
-->

# Resource Allocation & Management System Constitution

## Core Principles

### Princípio I: Clean Architecture & Separation of Concerns (NON-NEGOTIABLE)
The application MUST be structured using Clean Architecture guidelines. Core business logic (entities, values, and use cases) must remain independent of external details like framework (Spring Boot), database (JPA/Hibernate), or UI. Interfaces and adapters must decouple the core domain.

### Princípio II: Strict Object-Oriented Design & SOLID (NON-NEGOTIABLE)
All code must adhere to Object-Oriented Programming (OOP) best practices and SOLID principles. Avoid anemic domain models; encapsulate state and behavior. Follow Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles.

### Princípio III: Clean Resource Allocation & Scheduling Integrity (NON-NEGOTIABLE)
Resource allocation algorithms, availability rules, and reservation conflicts (e.g., preventing double-booking of laboratories/equipment, handling capacity constraints) must reside strictly within core domain entities as pure Java classes. This ensures all allocation rules are testable in isolation.

### Princípio IV: Test-Driven Domain-Logic Verification
Unit and integration tests must be written to cover all core domain use cases and rules. Test business logic in isolation without requiring Spring Boot framework context unless verifying integration points (e.g., repository adapters, controllers).

### Princípio V: Java 21 LTS & Spring Boot Architecture Separation
Leverage modern Java 21 features (records, pattern matching, structured concurrency where applicable) and Spring Boot 3+ idioms cleanly, ensuring frameworks are kept strictly at the adapter layer in Clean Architecture.

## Architectural & Technical Constraints

The system must run within a Dev Container using Java 21 LTS, Maven as the build system, and expose port 8080. Database interactions must be abstracted behind repository interfaces defined in the domain layer, implemented in the infrastructure layer using Spring Data JPA.

## Development & Verification Workflow

1. Write unit tests for core domain logic and verify they fail before implementing the logic.
2. Implement use cases and domain rules in pure Java.
3. Add Spring Boot infrastructure (controllers, repositories, config) in the outer layers.
4. Run integration tests on the database/API endpoints to verify end-to-end functionality.

## Governance

All code modifications must be reviewed for compliance with Clean Architecture and SOLID principles. The complexity of any implementation must be justified. Updates to this constitution require a version bump: major bump for changing core principles, minor bump for additions, and patch bump for clarifications.

**Version**: 1.0.0 | **Ratified**: 2026-05-30 | **Last Amended**: 2026-05-30
