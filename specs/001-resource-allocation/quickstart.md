# Quickstart Guide: Running and Testing SARC

This guide provides instructions to run and test the SARC system (microservices and Angular frontend) locally.

## Prerequisites
- Docker and Docker Compose
- Maven (pre-installed in devcontainer)
- Node.js & npm (for Angular frontend)

## 1. Running the System Locally

To bootstrap all services (Eureka, Config, Gateway, Keycloak, PostgreSQL, Microservices, and the Angular App):

```bash
# Build the project first
mvn clean package -DskipTests

# Start the environment
docker-compose up --build
```

### Accessing Services
- **Eureka Discovery**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **Keycloak Console**: http://localhost:8080/auth (or corresponding configured port)
- **Angular Frontend**: http://localhost:4200

## 2. Running Automated Tests

### Back-end tests
To run all tests across all microservices:
```bash
mvn test
```

To test a specific microservice, navigate to its directory and run:
```bash
cd backend/sarc-reservation-service
mvn test
```

### Front-end tests
Navigate to the Angular app directory and run:
```bash
cd frontend/sarc-web-angular
npm run test
```

## 3. Manual Verification Flow

1. **Boot the environment** via docker-compose.
2. **Access Keycloak** to seed initial admin, professor, and student users.
3. **Log in as Admin** on the Angular dashboard to create resources (laboratories, equipment), semesters, and classes.
4. **Log in as Professor** to allocate resources for a specific class. Test overlap errors by attempting a double booking.
5. **Log in as Student** to verify the list of active reservations for their classes is displayed in read-only mode.
