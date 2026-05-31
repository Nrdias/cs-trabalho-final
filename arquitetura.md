# Documento de Arquitetura de Software (OPEN SARC)

## 1. Visão Geral da Arquitetura (C4 Model - Nível de Container)

A solução é composta por uma arquitetura de microserviços, orquestrada via **Docker Compose**, onde múltiplas APIs de escopo delimitado se comunicam.

* **Acesso Externo:** O tráfego externo passa por um **Spring Cloud Gateway**, que atua como ponto único de entrada e resolve a camada de roteamento.
* 
**Autenticação:** O gateway e os microserviços delegam a validação de identidade para o **Keycloak** via protocolo OpenID Connect (OIDC).


* **Service Discovery & Configuração:** Todos os serviços se registram no **Netflix Eureka** e buscam suas variáveis de ambiente no **Spring Cloud Config Server**.
* **Banco de Dados:** Inicialmente, um banco de dados relacional **PostgreSQL (gerenciado no OCI)** é compartilhado entre os serviços, facilitando a fase inicial do projeto antes de uma eventual separação de dados por domínio.
* **Observabilidade:** Utiliza-se **OpenTelemetry (OTEL)** para coletar métricas e traces distribuídos de cada requisição.

---

## 2. Definição dos Microserviços e Rotas

A divisão foi feita baseada nas entidades do banco de dados e nos agrupamentos de User Stories (US) do documento de requisitos.

### 2.1. `sarc-user-service` (Gestão de Usuários)

Responsável pelo domínio de Usuários (`USUARIO`). Sincroniza informações complementares que não residem apenas no Keycloak (como matrícula, tipo de perfil e status).

| Rota | Método | Descrição | Regra de Acesso |
| --- | --- | --- | --- |
| `/api/v1/usuarios` | `POST` | Cadastrar professores, alunos e admins. | Admin |
| `/api/v1/usuarios/{id}` | `GET` | Consultar dados detalhados do usuário. | Admin / Próprio |
| `/api/v1/usuarios/{id}/status` | `PATCH` | Ativar/Inativar usuário. | Admin |

### 2.2. `sarc-academic-service` (Organização Acadêmica)

Gerencia as `TURMA`, `SEMESTRE` e a tabela associativa `ALUNO_TURMA`.

| Rota | Método | Descrição | Regra de Acesso |
| --- | --- | --- | --- |
| `/api/v1/semestres` | `GET`, `POST` | Gerir períodos letivos (identificação do semestre atual). | Admin |
| `/api/v1/turmas` | `POST` | Cadastrar novas turmas. | Admin |
| `/api/v1/turmas/{id}/professores` | `PUT` | Vincular/Desvincular professor (1:N). | Admin |
| `/api/v1/turmas/{id}/alunos` | `POST` | Vincular alunos à turma (N:N). | Admin |
| `/api/v1/alunos/me/turmas` | `GET` | Listar turmas do aluno logado (filtro do semestre). | Aluno |

### 2.3. `sarc-resource-service` (Gestão de Inventário)

Gerencia o domínio de `RECURSO` (Laboratórios e Equipamentos).

| Rota | Método | Descrição | Regra de Acesso |
| --- | --- | --- | --- |
| `/api/v1/recursos` | `POST` | Cadastrar laboratório ou equipamento. | Admin |
| `/api/v1/recursos` | `GET` | Listar recursos disponíveis. | Autenticado |
| `/api/v1/recursos/{id}` | `PUT`, `DELETE` | Editar campos ou remover recurso (valida se há reservas ativas). | Admin |

### 2.4. `sarc-reservation-service` (Gestão de Reservas)

Responsável pelo core do negócio (`RESERVA`). Valida conflitos de agenda e gerencia o status da ocupação.

| Rota | Método | Descrição | Regra de Acesso |
| --- | --- | --- | --- |
| `/api/v1/reservas` | `POST` | Solicitar reserva para data/hora. | Professor |
| `/api/v1/reservas/{id}/cancelar` | `PATCH` | Cancelar reserva existente. | Professor dono |
| `/api/v1/reservas/admin` | `GET` | Visão global de reservas com filtros (histórico, taxa de ocupação). | Admin |
| `/api/v1/reservas/professor` | `GET` | Consultar reservas do próprio professor. | Professor |
| `/api/v1/reservas/aluno` | `GET` | Consultar reservas vinculadas às turmas do aluno (somente leitura). | Aluno |

---

## 3. Planejamento do Front-End

Para atender aos diferentes perfis de usuários da instituição acadêmica, a camada de apresentação é dividida em duas frentes:

* **SARC Web Admin (React.js):** Um painel web focado em produtividade para o Administrador. Consome os endpoints de gestão e apresenta *dashboards* de taxa de ocupação de laboratórios e tabelas de dados complexas para cadastro.

---

## 4. Engenharia de Sistemas e Qualidade

* **Segurança (Keycloak):** O Keycloak atua como *Authorization Server*. O Front-end realiza o login, obtém um JWT (JSON Web Token) e o envia no cabeçalho `Authorization: Bearer <token>`. O API Gateway valida a assinatura do token antes de repassar a requisição aos microserviços.
* **Observabilidade (OTEL):** Agentes do OpenTelemetry injetados nos containers Spring Boot geram traces que são exportados via protocolo OTLP para um coletor (ex: Jaeger/Zipkin para traces e Prometheus para métricas). Isso permite ver exatamente quanto tempo uma requisição levou no Gateway, no `reservation-service` e na query do PostgreSQL.
* **Qualidade de Código (SonarQube):** Integrado à esteira de CI/CD (ou executado localmente via Docker), o SonarQube avalia cobertura de testes unitários (JUnit + Mockito), detecta *code smells* e valida vulnerabilidades conhecidas.

---

## 5. Arquivos Markdown para Spec Driven Development (SDD)

### 5.1. ADR-001: Compartilhamento Temporário de Banco de Dados

**Status:** Aceito
**Contexto:** O padrão estrito de microserviços exige "Database per Service". No entanto, a equipe necessita de velocidade inicial na entrega e modelagem.
**Decisão:** Utilizaremos uma única instância gerenciada de PostgreSQL no OCI compartilhada entre os 4 microserviços.
**Consequências:** - *Positivo:* Facilita o deployment inicial e reduz custos de infraestrutura no OCI.

* *Negativo:* Cria um acoplamento na camada de dados.
* *Mitigação:* Os microserviços **não** podem realizar `JOINs` entre tabelas de domínios diferentes diretamente no banco. Toda comunicação cruzada (ex: buscar os dados do usuário de uma reserva) deve ser feita via chamadas REST ou mensageria entre os serviços.

### 5.2. OpenAPI Specification (`swagger-reserva.yaml`)

```yaml
openapi: 3.0.3
info:
  title: SARC Reservation Service
  version: 1.0.0
  description: Microserviço para gestão de reservas de recursos acadêmicos.
paths:
  /api/v1/reservas:
    post:
      summary: Cria uma nova reserva
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReservaRequest'
      responses:
        '201':
          description: Reserva criada com sucesso
        '409':
          description: Conflito de agenda no recurso
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    ReservaRequest:
      type: object
      required: [id_recurso, id_turma, data_hora_inicio, data_hora_fim]
      properties:
        id_recurso:
          type: integer
        id_turma:
          type: integer
        data_hora_inicio:
          type: string
          format: date-time
        data_hora_fim:
          type: string
          format: date-time
        observacao:
          type: string

```
