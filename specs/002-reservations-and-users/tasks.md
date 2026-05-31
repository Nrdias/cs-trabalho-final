# Tasks: Reservations and Users Management

**Input**: Design documents from `/specs/002-reservations-and-users/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Isolated unit tests inside domain projects; integration testing inside Dev Container environment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US3, US4, US5...)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Validation and verification of the current local development environment and database integration.

- [x] T001 Verify Keycloak container status and realm settings in docker-compose.yml
- [x] T002 Verify multi-service launch and health status under root docker-compose.yml
- [x] T003 [P] Verify PostgreSQL database connectivity and schemas status in local context

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify gateway token propagation and ensure domain filters work correctly.

- [x] T004 Setup and verify authorization filtering configuration in backend/sarc-gateway/src/main/java/com/sarc/gateway/SecurityConfig.java
- [x] T005 Validate JWT resource server configuration across microservices resource configurations

---

## Phase 3: User Story 3 - Visão Global de Reservas (Administrador) (Priority: P2)

**Goal**: Allow Administrator to view all institutional reservations with advanced filtering options (by professor, resource, date, or semester letivo) and view occupancy rates.

**Independent Test**: Login as admin, access the dashboard, and apply various filters.

### Implementation for User Story 3

- [x] T006 [US3] Implement and verify reservations retrieval endpoints with query params in backend/sarc-reservation-service/src/main/java/com/sarc/reservation/adapters/ReservaController.java
- [x] T007 [US3] Verify global reservations list component with filters in frontend/sarc-web-react/src/pages/AdminDashboard.tsx

---

## Phase 4: User Story 4 - Autenticação do Administrador (Priority: P1)

**Goal**: Safely authenticate Administrator and redirect to admin management tools.

**Independent Test**: Use admin login credentials on Keycloak login page and check if dashboard loads.

### Implementation for User Story 4

- [x] T008 [US4] Configure admin credentials in Keycloak realm profile config
- [x] T009 [US4] Verify login redirect and admin role mapping in frontend/sarc-web-react/src/App.tsx

---

## Phase 5: User Story 5 - Cadastro de Usuários (Priority: P1)

**Goal**: Administrator registers teachers, students, and other administrators with default details, prompting password generation.

**Independent Test**: Create a user and check temporary password generation in logs/response.

### Implementation for User Story 5

- [x] T010 [US5] Implement and test password generation response logic in backend/sarc-user-service/src/main/java/com/sarc/user/adapters/UsuarioController.java
- [x] T011 [US5] Implement UI form for registering users in frontend/sarc-web-react/src/pages/UserManagement.tsx

---

## Phase 6: User Story 6 - Cadastro de Turmas (Priority: P2)

**Goal**: Administrator creates new academic classes with unique codes.

**Independent Test**: Add class and check unique constraint validations.

### Implementation for User Story 6

- [x] T012 [US6] Implement class persistency logic with unique code constraint in backend/sarc-academic-service/src/main/java/com/sarc/academic/adapters/TurmaController.java
- [x] T013 [US6] Verify class creation page fields in frontend/sarc-web-react/src/pages/ClassManagement.tsx

---

## Phase 7: User Story 7 - Vinculação de Professores e Alunos às Turmas (Priority: P2)

**Goal**: Administrator links professors (1:N) and students (N:N) to classes.

**Independent Test**: Associate student/teacher to classes and verify relation in dashboard list.

### Implementation for User Story 7

- [x] T014 [US7] Implement link endpoints in backend/sarc-academic-service/src/main/java/com/sarc/academic/adapters/TurmaController.java
- [x] T015 [US7] Verify teacher-student association UI controls in frontend/sarc-web-react/src/pages/ClassManagement.tsx

---

## Phase 8: User Story 8 - Autenticação do Professor (Priority: P1)

**Goal**: Authenticate Professor profile and restrict view to their linked classes.

**Independent Test**: Login as a professor and confirm only linked classes show up.

### Implementation for User Story 8

- [x] T016 [US8] Verify authentication mapping for PROFESSOR role in frontend/sarc-web-react/src/App.tsx
- [x] T017 [US8] Replace hardcoded professor mock IDs with Keycloak authenticated claims in frontend/sarc-web-react/src/pages/TeacherDashboard.tsx

---

## Phase 9: User Story 9 - Consultar Minhas Reservas (Professor) (Priority: P2)

**Goal**: Allow professor to view their own reservations and apply resource/date filters.

**Independent Test**: Filter reservations by resource type.

### Implementation for User Story 9

- [x] T018 [US9] Implement professor-only search filters in backend/sarc-reservation-service/src/main/java/com/sarc/reservation/adapters/ReservaController.java
- [x] T019 [US9] Replace hardcoded mock IDs with active token payload inside frontend/sarc-web-react/src/components/MyReservations.tsx

---

## Phase 10: User Story 10 - Reservar Laboratórios e Equipamentos (Priority: P1)

**Goal**: Let professor request reservation for a class with conflict-checking verification.

**Independent Test**: Request booking on occupied slot and check for duplicate block error.

### Implementation for User Story 10

- [x] T020 [US10] Implement FCFS overlap checking logic in backend/sarc-reservation-service/src/main/java/com/sarc/reservation/adapters/ReservaController.java
- [x] T021 [US10] Connect booking modal payload dynamically to token in frontend/sarc-web-react/src/components/BookResourceModal.tsx

---

## Phase 11: User Story 11 - Cancelar Reservas (Priority: P2)

**Goal**: Allow professor to cancel their own reservations with confirmation alert.

**Independent Test**: Cancel reservation, check instant calendar availability.

### Implementation for User Story 11

- [x] T022 [US11] Implement cancellation verification in backend/sarc-reservation-service/src/main/java/com/sarc/reservation/adapters/ReservaController.java
- [x] T023 [US11] Connect confirmation alert and callback triggers in frontend/sarc-web-react/src/components/CancelBookingButton.tsx

---

## Phase 12: User Story 12 - Autenticação do Aluno (Priority: P1)

**Goal**: Log in Aluno profile and redirect to query-only screen.

**Independent Test**: Login as student and verify search dashboard displays.

### Implementation for User Story 12

- [x] T024 [US12] Verify login mapping and routing rules for ALUNO role in frontend/sarc-web-react/src/App.tsx
- [x] T025 [US12] Replace hardcoded student mock IDs with token user sub/preferred_username claims in frontend/sarc-web-react/src/pages/StudentDashboard.tsx

---

## Phase 13: User Story 13 - Consultar Reservas (Aluno) (Priority: P2)

**Goal**: Aluno views read-only list of reservations filtered by their classes.

**Independent Test**: Verify student has no options to create/modify reservations.

### Implementation for User Story 13

- [x] T026 [US13] Implement query endpoint filtering by list of class IDs in backend/sarc-reservation-service/src/main/java/com/sarc/reservation/adapters/ReservaController.java
- [x] T027 [US13] Integrate read-only table rendering in frontend/sarc-web-react/src/pages/StudentDashboard.tsx

---

## Phase 14: User Story 14 - Filtrar Consultas por Turma e/ou Data (Priority: P3)

**Goal**: Aluno filters by class, date, or both. Default to current week.

**Independent Test**: Apply combined filters on student page.

### Implementation for User Story 14

- [x] T028 [US14] Implement logic for combined filters in frontend/sarc-web-react/src/pages/StudentDashboard.tsx

---

## Phase 15: User Story 15 - Visualização por Semestre Vigente (Priority: P3)

**Goal**: Limit default query view to the active academic semester.

**Independent Test**: Verify old semester bookings only show when "History" is selected.

### Implementation for User Story 15

- [x] T029 [US15] Implement default active semester search logic in backend/sarc-academic-service/src/main/java/com/sarc/academic/adapters/TurmaController.java
- [x] T030 [US15] Integrate "History" toggle controls in frontend/sarc-web-react/src/pages/StudentDashboard.tsx

---

## Phase 16: Polish & Cross-Cutting Concerns

**Purpose**: Verify end-to-end functionality, perform UX check, and cleanup test states.

- [x] T031 Perform comprehensive verification of reservation filters and user roles
- [x] T032 Run Maven tests verifying domain rules logic completeness

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup.
- **User Stories (Phase 3+)**: All depend on Foundational completion.
- **Polish (Phase 16)**: Depends on all user stories completion.

### Parallel Opportunities

- Setup tasks (T001-T003) can run in parallel.
- Story tasks can be implemented incrementally and in parallel across different controllers/components.
