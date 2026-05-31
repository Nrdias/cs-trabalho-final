# Research Notes: SARC Architecture and Setup Decisions

## 1. Multi-Module Project Build Setup
* **Decision**: We will structure the backend as a Maven multi-module project at the `backend/` directory root, with a parent `pom.xml` containing common dependencies and version properties.
* **Rationale**: Simplifies compiling, packaging, and testing all 7 microservice projects together.
* **Alternatives Considered**: Individual independent Maven projects (rejected due to difficulty in running build pipelines across multiple repositories or subdirectories).

## 2. Authentication Integration (Keycloak + Spring Cloud Gateway + Angular)
* **Decision**: 
  - Angular frontend handles the login flow using OIDC/OAuth2 authorization code flow with PKCE via `angular-oauth2-oidc` library.
  - Spring Cloud Gateway acts as a OAuth2 Resource Server or decrypts JWT tokens before routing them, passing the client user claims (`id_usuario`, roles) to downstream microservices in the HTTP headers (e.g. `X-User-Id`, `X-User-Roles`).
  - Downstream microservices authenticate calls based on incoming token validation or trusted headers from the Gateway.
* **Rationale**: Avoids the need for each individual microservice to connect to Keycloak for token verification on every request.
* **Alternatives Considered**: Direct token validation in each microservice (rejected due to high performance overhead).

## 3. Database Strategy and ADR-001 Validation
* **Decision**: Create a single PostgreSQL container in the root `docker-compose.yml` for local development. Separate schemas (`user_schema`, `resource_schema`, `academic_schema`, `reservation_schema`) within the same database will be used to logically decouple data, keeping the database sharing structured.
* **Rationale**: Prepares the project for database separation without incurring the memory and configuration cost of running 4 distinct DB servers in dev containers.
* **Alternatives Considered**: Running 4 separate PostgreSQL Docker containers (rejected due to high resource usage on the developer's machine).

## 4. Conflict Verification & FCFS (First-Come, First-Served) Booking Logic
* **Decision**:
  - The domain entity `Reserva` will contain the validation method `boolean overlapsWith(Reserva other)` to check for scheduling conflicts.
  - In `sarc-reservation-service`, a database unique constraint / index or transaction isolation level (SERIALIZABLE or pessimistic locking) will be used to guarantee that concurrent threads cannot double-book a resource at the database level.
  - The domain check is the primary gate; the DB unique index is the final safeguard.
* **Rationale**: Ensures the business rule is testable as pure unit tests, while protecting against race conditions in concurrent web requests.
