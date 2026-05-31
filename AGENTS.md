<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan at [plan.md](file:///Users/natandias/workspace/cs-trabalho-final/specs/002-reservations-and-users/plan.md)
<!-- SPECKIT END -->

# Development Environment
This project runs inside a Dev Container designed for Java and Spring Boot development.

## Environment Constraints
- **Java Platform**: Java 21 LTS
- **Build System**: Maven (pre-installed, wrapper preferred if available)
- **Application Server Port**: `8080` (automatically forwarded to the host)

## Command Execution Rules
- Run Java-related commands (e.g., `./mvnw clean package`, `mvn compile`) from the root workspace folder.
- Do not attempt to install Java versions or global SDKs manually via system package managers (apt, etc.) — if environment changes are required, update the Dev Container configuration.
