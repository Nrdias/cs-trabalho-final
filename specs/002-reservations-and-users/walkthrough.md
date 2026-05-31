# Walkthrough: Reservations and Users Management

## Changes Made

### 1. Backend

#### [UsuarioController.java](file:///Users/natandias/workspace/cs-trabalho-final/backend/sarc-user-service/src/main/java/com/sarc/user/adapters/UsuarioController.java)
- Added GET `/api/v1/usuarios/email` endpoint to fetch user details dynamically from the database using their email (`preferred_username` from token).

### 2. Frontend

#### [StudentDashboard.tsx](file:///Users/natandias/workspace/cs-trabalho-final/frontend/sarc-web-react/src/pages/StudentDashboard.tsx)
- Replaced the hardcoded mock student ID (`const idAlunoMock = 1;`) with a dynamic lookup using the active token's `username` payload.

#### [TeacherDashboard.tsx](file:///Users/natandias/workspace/cs-trabalho-final/frontend/sarc-web-react/src/pages/TeacherDashboard.tsx)
- Replaced the hardcoded mock teacher ID (`const idProfessorMock = 1;`) with a dynamic lookup using the active token's `username` payload.

#### [MyReservations.tsx](file:///Users/natandias/workspace/cs-trabalho-final/frontend/sarc-web-react/src/components/MyReservations.tsx)
- Destructured `username` from `useAuth()` and replaced mock professor ID with dynamic API lookup.

---

## Verification Results

1. **Jars compilation**: Recompiled the modified services using Maven in a docker container. All services compiled successfully.
2. **Container status**: Restarted `sarc-user-service` to run the updated class.
