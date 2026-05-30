# Feature Specification: Resource Allocation System

**Feature Branch**: `001-resource-allocation`

**Created**: 2026-05-30

**Status**: Draft

**Input**: User description: "O objetivo do produto é possibilitar a correta alocação de recursos, gerenciando estes disponíveis como, laboratórios e equipamentos. Teremos dois sistemas, um front e um back-end"

## Clarifications

### Session 2026-05-30

- Q: Quais são os perfis de usuários e seus níveis de permissão no sistema? → A: Administrador (gestão total de recursos, usuários, turmas e visão global de reservas), Professor (reserva e cancela recursos para suas turmas, consulta suas reservas), Aluno (consulta simplificada das reservas de suas turmas).
- Q: Como devem ser resolvidos os conflitos de agendamento/alocação de recursos? → A: Ordem de chegada (First-Come, First-Served) automática.
- Q: Qual tecnologia/framework será utilizada para o front-end? → A: Angular.

## User Scenarios & Testing *(mandatory)*

### 1. Administrador

#### US01: Cadastrar Laboratórios e Equipamentos (Priority: P1)
Como administrador, quero cadastrar novos laboratórios e equipamentos para que eles fiquem disponíveis no catálogo para reservas dos professores.
- **Why this priority**: É a funcionalidade que permite popular o catálogo de recursos para que possam ser alocados.
- **Independent Test**: O administrador cadastra um recurso e verifica se ele é exibido corretamente no inventário de recursos disponíveis.
- **Acceptance Scenarios**:
  - **Given** que o administrador está na tela de cadastro de recursos, **When** insere nome, localização, descrição e indica o tipo ("Laboratório" ou "Equipamento") com identificador único não existente, **Then** o recurso é cadastrado com sucesso.
  - **Given** que um recurso com identificador "LAB-101" já existe, **When** o administrador tenta cadastrar outro recurso com esse mesmo identificador, **Then** o sistema exibe um erro de duplicidade e impede o cadastro.

#### US02: Editar e Remover Recursos (Priority: P2)
Como administrador, quero editar as informações ou remover laboratórios e equipamentos para que o inventário reflita a disponibilidade real dos recursos da instituição.
- **Why this priority**: Permite manter o cadastro atualizado.
- **Independent Test**: O administrador atualiza os dados de um recurso ou remove um recurso sem reservas e verifica o inventário.
- **Acceptance Scenarios**:
  - **Given** um recurso existente, **When** o administrador edita seus campos e salva, **Then** os dados atualizados são persistidos.
  - **Given** um recurso que possui reservas ativas ou agendadas, **When** o administrador tenta removê-lo, **Then** o sistema impede a remoção e alerta sobre as reservas ativas vinculadas.
  - **Given** um recurso sem reservas ativas, **When** o administrador solicita a remoção, **Then** o sistema exibe um alerta de confirmação antes de efetivar a exclusão.

#### US03: Visão Global de Reservas (Administrador) (Priority: P2)
Como administrador, quero consultar todas as reservas efetuadas no sistema por qualquer professor para que eu possa monitorar a ocupação dos laboratórios, auditar o uso de equipamentos e identificar gargalos na alocação.
- **Why this priority**: Visibilidade geral e auditoria da utilização de recursos.
- **Independent Test**: O administrador acessa o painel de reservas globais e aplica os filtros de data, professor ou recurso.
- **Acceptance Scenarios**:
  - **Given** que o administrador acessa o painel geral de reservas, **Then** ele visualiza todas as reservas da instituição, sem restrição de professor ou turma.
  - **Given** o painel de reservas, **When** filtra por professor, recurso, data ou semestre, **Then** a lista exibe apenas os registros correspondentes.
  - **Given** a consulta de um recurso específico, **When** o administrador seleciona a opção de histórico, **Then** ele visualiza a frequência e datas de uso desse recurso.
  - **Given** um período de tempo selecionado, **When** o administrador solicita o resumo de ocupação, **Then** o sistema gera a taxa de ocupação dos laboratórios para aquele período.

#### US04: Autenticação do Administrador (Priority: P1)
Como administrador, quero realizar login no sistema para que eu possa acessar as ferramentas de gestão com segurança.
- **Why this priority**: Segurança e controle de acesso a funções administrativas.
- **Independent Test**: O administrador tenta fazer login com credenciais válidas e inválidas.
- **Acceptance Scenarios**:
  - **Given** a tela de login, **When** insere e-mail/usuário e senha corretos, **Then** é autenticado e redirecionado para o dashboard de gestão.
  - **Given** a tela de login, **When** insere credenciais inválidas, **Then** o sistema impede o acesso e exibe uma mensagem de erro clara.

#### US05: Cadastro de Usuários (Priority: P2)
Como administrador, quero cadastrar professores, alunos e outros administradores para que cada integrante da instituição possa utilizar o sistema conforme seu nível de permissão.
- **Why this priority**: Permite povoar os usuários que utilizarão o sistema.
- **Independent Test**: O administrador cria um novo usuário e valida se o perfil correspondente foi atribuído.
- **Acceptance Scenarios**:
  - **Given** que o administrador preenche o formulário de cadastro com nome, matrícula/CPF, e-mail e perfil (Admin, Professor ou Aluno), **When** confirma a gravação, **Then** o usuário é cadastrado e uma senha temporária ou e-mail de boas-vindas é gerado.

#### US06: Cadastro de Turmas (Priority: P2)
Como administrador, quero cadastrar novas turmas para que o cronograma acadêmico seja organizado dentro da plataforma.
- **Why this priority**: Organização das turmas para vinculação às reservas.
- **Independent Test**: O administrador cadastra uma nova turma e verifica se o código identificador é único.
- **Acceptance Scenarios**:
  - **Given** que o administrador informa o nome/código único (ex: "Turma 302 - Engenharia") e o período/semestre letivo vigente, **When** salva, **Then** a turma é criada com sucesso.

#### US07: Vinculação de Professores e Alunos às Turmas (Priority: P2)
Como administrador, quero vincular professores e alunos às turmas cadastradas para que os professores possam reservar recursos para suas aulas e os alunos visualizem seus respectivos horários.
- **Why this priority**: Estabelece os relacionamentos necessários para a regra de negócio de reservas.
- **Independent Test**: O administrador vincula um professor a múltiplas turmas e alunos a múltiplas turmas.
- **Acceptance Scenarios**:
  - **Given** uma turma e um professor, **When** o administrador vincula o professor à turma, **Then** a relação é gravada (permitindo 1 professor para N turmas).
  - **Given** alunos e turmas, **When** o administrador realiza a matrícula dos alunos, **Then** o sistema permite a vinculação N:N (múltiplos alunos a múltiplas turmas).
  - **Given** uma turma com professor vinculado, **When** o administrador desvincula ou troca o professor, **Then** a alteração é aplicada imediatamente.

---

### 2. Professor

#### US08: Autenticação do Professor (Priority: P1)
Como professor, quero realizar login no sistema para que eu possa acessar minhas turmas e gerenciar minhas reservas.
- **Why this priority**: Segurança e controle de acesso personalizado para o professor.
- **Independent Test**: O professor faz login com credenciais geradas.
- **Acceptance Scenarios**:
  - **Given** a tela de login, **When** insere credenciais válidas de professor, **Then** é redirecionado para a área de professor onde visualiza apenas as turmas vinculadas a ele.

#### US09: Consultar Minhas Reservas (Professor) (Priority: P2)
Como professor, quero visualizar a lista de reservas que fiz para gerenciar minhas aulas e recursos.
- **Why this priority**: Autogestão de agendamentos.
- **Independent Test**: O professor acessa a lista e verifica se constam apenas suas próprias reservas.
- **Acceptance Scenarios**:
  - **Given** o painel do professor, **When** acessa a consulta de reservas, **Then** apenas as reservas criadas pelo próprio professor logado são mostradas.
  - **Given** a lista de reservas, **When** filtra por período (início/fim) e tipo de recurso (laboratório ou equipamento), **Then** a visualização exibe as reservas correspondentes detalhando para qual turma a alocação foi feita.

#### US10: Reservar Laboratórios e Equipamentos (Priority: P1)
Como professor, quero solicitar a reserva de um recurso ativo para um período livre vinculado a uma das minhas turmas.
- **Why this priority**: Funcionalidade principal de agendamento por parte do professor.
- **Independent Test**: O professor tenta realizar reservas válidas e reservas com choque de horário.
- **Acceptance Scenarios**:
  - **Given** um recurso ativo e sem reserva no período selecionado, **When** o professor solicita a reserva vinculada a uma de suas turmas, **Then** a reserva é confirmada (regra de primeiro a chegar).
  - **Given** um recurso já ocupado, **When** o professor tenta reservar para o mesmo período, **Then** o sistema bloqueia e alerta sobre o conflito de agenda.

#### US11: Cancelar Reservas (Priority: P2)
Como professor, quero cancelar uma reserva própria para liberar o recurso.
- **Why this priority**: Liberação de recursos não utilizados.
- **Independent Test**: O professor cancela uma reserva e verifica se o recurso volta a ficar disponível.
- **Acceptance Scenarios**:
  - **Given** que o professor visualiza suas reservas, **When** ele seleciona cancelar em uma reserva feita por ele e confirma, **Then** a reserva é cancelada e o recurso fica imediatamente disponível para novas alocações.
  - **Given** uma reserva de outro professor, **When** o sistema exibe a interface, **Then** não permite ao professor atual solicitar o cancelamento dessa reserva.

---

### 3. Aluno

#### US12: Autenticação do Aluno (Priority: P1)
Como aluno, quero logar para acompanhar meu cronograma de aulas.
- **Why this priority**: Acesso seguro à consulta de horários do aluno.
- **Acceptance Scenarios**:
  - **Given** a tela de login, **When** o aluno insere suas credenciais, **Then** ele é direcionado para a interface simplificada de consulta (sem permissões de gravação).

#### US13: Consultar Reservas (Priority: P2)
Como aluno, quero visualizar a lista de reservas das minhas turmas de forma somente leitura.
- **Why this priority**: Visualização da agenda de aulas em laboratórios.
- **Acceptance Scenarios**:
  - **Given** que o aluno está logado, **When** visualiza a lista de reservas, **Then** ela é filtrada automaticamente apenas pelas turmas em que está matriculado. O aluno não tem opções para criar, editar ou cancelar reservas.

#### US14: Filtrar Consultas por Turma e/ou Data (Priority: P3)
Como aluno, quero aplicar filtros por turma e data para ver minhas reservas.
- **Acceptance Scenarios**:
  - **Given** a tela de consulta do aluno, **When** ele seleciona uma de suas turmas ou uma data específica, **Then** visualiza apenas as reservas correspondentes daquela turma ou dia.
  - **Given** que nenhum filtro é aplicado, **Then** o sistema lista por padrão todas as reservas das turmas do aluno para a semana vigente.

#### US15: Visualização por Semestre Vigente (Priority: P3)
Como aluno, quero ver as reservas restritas ao semestre atual por padrão.
- **Acceptance Scenarios**:
  - **Given** a consulta de reservas do aluno, **When** acessada, **Then** o sistema exibe apenas as informações do semestre letivo vigente.
  - **Given** a consulta, **When** o aluno clica explicitamente na opção de "Histórico", **Then** ele pode alternar para semestres anteriores.

---

## Out of Scope (Fora do Escopo)

- Alocações de recursos para eventos (o foco é estritamente em alocação por turmas acadêmicas).
- Troca de recursos diretamente entre professores.
- Solicitação ou realização de reservas por alunos (os alunos possuem apenas perfil de consulta/leitura).

---

## Edge Cases

- O que acontece se o usuário tentar criar uma reserva com horário de término anterior ou igual ao horário de início? (O sistema deve validar e rejeitar no domínio).
- Como o sistema se comporta se um recurso cadastrado for desativado temporariamente (manutenção) enquanto possui reservas ativas? (O sistema deve manter as reservas históricas mas impedir novas).
- O que acontece se dois usuários tentarem reservar exatamente o mesmo recurso e horário simultaneamente (condição de corrida)? (Tratamento com concorrência otimista/pesimista garantindo a primeira confirmação).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir o cadastro, edição, consulta e exclusão de recursos do tipo Laboratório e Equipamento pelo administrador (US01, US02).
- **FR-002**: O sistema MUST permitir o cadastro de usuários e atribuição dos perfis Admin, Professor e Aluno (US05).
- **FR-003**: O sistema MUST permitir o cadastro de turmas e a vinculação de professor (1:N) e alunos (N:N) às turmas (US06, US07).
- **FR-004**: O sistema MUST validar e bloquear agendamentos conflitantes no mesmo horário para o mesmo recurso usando a regra de primeiro a chegar (First-Come, First-Served) (US10).
- **FR-005**: O sistema MUST permitir que professores criem reservas associadas obrigatoriamente a uma turma na qual lecionam (US10).
- **FR-006**: O sistema MUST restringir a visualização de reservas de alunos estritamente às turmas em que estão matriculados (US13).
- **FR-007**: O sistema MUST disponibilizar autenticação segura para Administradores, Professores e Alunos (US04, US08, US12).
- **FR-008**: O back-end MUST expor APIs HTTP REST em JSON para comunicação com o front-end Angular (FR-009).
- **FR-009**: O front-end MUST ser desenvolvido de forma desacoplada em Angular, consumindo as APIs REST do back-end.

### Key Entities

- **Recurso**: Representa o laboratório ou equipamento (ID, Nome, Localização, Descrição, Tipo, Status).
- **Usuário**: Pessoa cadastrada no sistema (ID, Nome, Matrícula/CPF, Email, Senha, Perfil).
- **Turma**: Agrupamento acadêmico (ID, Nome/Código Único, Semestre Letivo, Professor Vinculado, Alunos Matriculados).
- **Reserva / Alocação**: Registro do agendamento (ID, Recurso, Turma, Professor Solicitante, Data, Hora de Início, Hora de Término, Status).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O tempo de resposta na busca de disponibilidade de recursos no front-end Angular deve ser inferior a 1.5 segundos.
- **SC-002**: 100% dos conflitos de horário em reservas de recursos concorrentes devem ser impedidos pelo back-end no nível de domínio.
- **SC-003**: O front-end Angular e o back-end Java/Spring Boot devem rodar como processos independentes, comunicando-se unicamente via HTTP.

## Assumptions

- O back-end será desenvolvido em Java 21 utilizando Spring Boot 3+ e Clean Architecture.
- O front-end será desenvolvido em Angular.
- O banco de dados para persistência será relacional.
- Concorrência de agendamentos simultâneos será resolvida pelo mecanismo de concorrência no banco de dados com a regra de First-Come, First-Served.
