# SARC Quickstart: Run and Develop

This guide outlines how to execute and verify SARC services locally.

## Running the Application

Ensure you are inside the Dev Container. You can start all microservices, Keycloak, and the React frontend by executing:

```bash
docker-compose up --build
```

### Exposed Services

- **Gateway**: `http://localhost:8080` (all api routes go through here)
- **Frontend React app**: `http://localhost:5173` (or forwarded port)
- **Keycloak Console**: `http://localhost:8080/auth` (admin/admin credentials)

## Verification / Running Tests

To verify backend domain logic and integration points, run Maven test from the root:

```bash
./mvnw clean test
```
