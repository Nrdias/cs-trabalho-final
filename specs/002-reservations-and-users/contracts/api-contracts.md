# API Contracts: SARC Services

This document lists the REST contracts for SARC microservices.

## 1. User Service (`/api/v1/usuarios`)

### POST `/api/v1/usuarios`
- Request:
  ```json
  {
    "nome": "Professor Natan",
    "email": "natan@sarc.edu",
    "matriculaCpf": "123456",
    "tipo": "PROFESSOR"
  }
  ```
- Response (`201 Created`):
  ```json
  {
    "usuario": {
      "idUsuario": 1,
      "nome": "Professor Natan",
      "email": "natan@sarc.edu",
      "matriculaCpf": "123456",
      "tipo": "PROFESSOR",
      "ativo": true
    },
    "senhaTemporaria": "abc123xy",
    "boasVindasEmail": "Enviado e-mail de boas-vindas para natan@sarc.edu"
  }
  ```

---

## 2. Reservation Service (`/api/v1/reservas`)

### GET `/api/v1/reservas/admin`
- Request Parameters:
  - `idRecurso` (optional)
  - `idProfessor` (optional)
  - `idTurma` (optional)
- Response (`200 OK`):
  ```json
  [
    {
      "idReserva": 1,
      "dataHoraInicio": "2026-06-01T08:00:00",
      "dataHoraFim": "2026-06-01T10:00:00",
      "status": "CONFIRMADA",
      "observacao": "Aula prática",
      "idProfessor": 1,
      "idRecurso": 2,
      "idTurma": 3
    }
  ]
  ```

### POST `/api/v1/reservas`
- Request:
  ```json
  {
    "idRecurso": 2,
    "idTurma": 3,
    "idProfessor": 1,
    "dataHoraInicio": "2026-06-01T08:00:00",
    "dataHoraFim": "2026-06-01T10:00:00",
    "observacao": "Aula prática"
  }
  ```
- Response (`201 Created`):
  ```json
  {
    "idReserva": 1,
    "dataHoraInicio": "2026-06-01T08:00:00",
    "dataHoraFim": "2026-06-01T10:00:00",
    "status": "CONFIRMADA",
    "observacao": "Aula prática",
    "idProfessor": 1,
    "idRecurso": 2,
    "idTurma": 3
  }
  ```
