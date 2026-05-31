# Feature Specification: Reservations and Users Management

**Feature Branch**: `002-reservations-and-users`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "a infra está completa, mas as funcionalidades ainda estão faltando (atualmente somente a funcionalidade do administrador criar/remover recursos está disponível, irei lhe encaminhar as user-stories, preciso que revise confome us.pdf"

## User Scenarios & Testing *(mandatory)*

### 1. Administrador

#### US03: Visão Global de Reservas (Administrador) (Priority: P2)
Como administrador, quero consultar todas as reservas efetuadas no sistema por qualquer professor para que eu possa monitorar a ocupação dos laboratórios, auditar o uso de equipamentos e identificar gargalos na alocação.
- **Why this priority**: Permite ao administrador auditar e gerenciar a alocação de recursos em toda a instituição.
- **Independent Test**: O administrador acessa a tela de visão global de reservas, aplica filtros de professor, recurso, data ou semestre, e verifica se os registros exibidos correspondem aos filtros.
- **Acceptance Scenarios**:
  - **Given** que o administrador acessa o painel geral de reservas, **Then** o sistema exibe todas as reservas da instituição de forma irrestrita.
  - **Given** o painel de reservas, **When** o administrador filtra por nome do professor, nome do recurso, data específica ou semestre letivo, **Then** a lista exibe apenas os registros correspondentes.
  - **Given** a consulta de um recurso específico, **When** o administrador seleciona a visualização de histórico, **Then** o sistema exibe a frequência e todas as datas de utilização daquele recurso.
  - **Given** um período de tempo e recurso selecionado, **When** o administrador solicita o resumo, **Then** o sistema exibe a taxa de ocupação correspondente para aquele período.

#### US04: Autenticação do Administrador (Priority: P1)
Como administrador, quero realizar login no sistema para que eu possa acessar as ferramentas de gestão com segurança.
- **Why this priority**: Garante que apenas usuários com papel de administrador acessem as telas e funcionalidades de gestão do sistema.
- **Independent Test**: O administrador digita credenciais corretas e incorretas e valida se o acesso é concedido ou negado de forma segura.
- **Acceptance Scenarios**:
  - **Given** a tela de login, **When** insere e-mail/usuário e senha válidos de um administrador, **Then** o sistema autentica com sucesso e redireciona para o dashboard administrativo.
  - **Given** a tela de login, **When** insere credenciais inválidas, **Then** o sistema impede o login e exibe uma mensagem de erro clara e amigável.

#### US05: Cadastro de Usuários (Priority: P1)
Como administrador, quero cadastrar professores, alunos e outros administradores para que cada integrante da instituição possa utilizar o sistema conforme seu nível de permissão.
- **Why this priority**: É essencial para povoar a base de usuários do sistema, permitindo que professores façam reservas e alunos realizem consultas.
- **Independent Test**: O administrador cadastra um novo usuário de cada perfil e verifica se o perfil foi salvo corretamente.
- **Acceptance Scenarios**:
  - **Given** que o administrador está na tela de cadastro de usuários, **When** insere nome, matrícula/CPF, e-mail e seleciona obrigatoriamente um perfil (Admin, Professor ou Aluno), **Then** o usuário é cadastrado no sistema.
  - **Given** que um novo usuário é cadastrado com sucesso, **Then** o sistema gera automaticamente uma senha temporária ou envia um e-mail de boas-vindas para o e-mail informado.

#### US06: Cadastro de Turmas (Priority: P2)
Como administrador, quero cadastrar novas turmas para que o cronograma acadêmico seja organizado dentro da plataforma.
- **Why this priority**: As turmas são necessárias para que as reservas de recursos feitas por professores e visualizadas por alunos estejam vinculadas ao contexto letivo.
- **Independent Test**: O administrador cria uma turma e verifica se o identificador único impede a duplicidade.
- **Acceptance Scenarios**:
  - **Given** que o administrador está na tela de cadastro de turmas, **When** insere um nome ou código identificador único (ex: "Turma 302 - Engenharia") e o período letivo/semestre vigente, **Then** a turma é cadastrada com sucesso.

#### US07: Vinculação de Professores e Alunos às Turmas (Priority: P2)
Como administrador, quero vincular professores e alunos às turmas cadastradas para estruturar a matriz de permissões e visualizações de reservas.
- **Why this priority**: Estabelece os relacionamentos que determinam quais recursos o professor pode reservar (para suas turmas) e quais o aluno pode consultar (das suas turmas).
- **Independent Test**: O administrador realiza a vinculação de professores e alunos a turmas e verifica se as relações são refletidas nos perfis.
- **Acceptance Scenarios**:
  - **Given** uma turma cadastrada, **When** o administrador vincula um professor, **Then** a relação é gravada respeitando a regra de que 1 professor pode estar vinculado a múltiplas turmas (1:N).
  - **Given** alunos e turmas cadastradas, **When** o administrador matricula os alunos, **Then** o sistema permite a vinculação N:N (múltiplos alunos a múltiplas turmas).
  - **Given** uma turma com professor vinculado, **When** o administrador desvincula ou altera o professor da turma, **Then** a alteração é aplicada imediatamente.

---

### 2. Professor

#### US08: Autenticação do Professor (Priority: P1)
Como professor, quero realizar login no sistema para que eu possa acessar minhas turmas e gerenciar minhas reservas.
- **Why this priority**: Garante acesso seguro e personalizado às informações e turmas do professor.
- **Independent Test**: O professor realiza login com suas credenciais cadastradas e verifica se vê apenas suas turmas.
- **Acceptance Scenarios**:
  - **Given** a tela de login, **When** insere credenciais válidas de professor, **Then** é redirecionado para o painel do professor e visualiza apenas as turmas às quais está vinculado.

#### US09: Consultar Minhas Reservas (Professor) (Priority: P2)
Como professor, quero visualizar uma lista detalhada das reservas que eu realizei para que eu possa gerir meu cronograma de aulas e conferir os recursos alocados.
- **Why this priority**: Permite ao professor acompanhar e planejar a utilização de recursos em suas turmas.
- **Independent Test**: O professor acessa a consulta de reservas e verifica se a listagem exibe somente as suas reservas.
- **Acceptance Scenarios**:
  - **Given** que o professor está logado, **When** acessa a tela de consulta de reservas, **Then** o sistema exibe apenas as reservas efetuadas pelo próprio professor logado.
  - **Given** a consulta de reservas do professor, **When** aplica filtros por período (data inicial e final) e por tipo de recurso (laboratório ou equipamento), **Then** o sistema exibe os resultados correspondentes indicando para qual turma específica cada recurso foi reservado.

#### US10: Reservar Laboratórios e Equipamentos (Priority: P1)
Como professor, quero solicitar a reserva de um laboratório ou equipamento para uma data e horário específicos para que eu possa garantir os recursos necessários para a realização da minha aula.
- **Why this priority**: É a funcionalidade principal do fluxo de reserva de recursos.
- **Independent Test**: O professor tenta realizar reservas válidas, com conflito de horário e para recursos inativos, validando os comportamentos.
- **Acceptance Scenarios**:
  - **Given** que o professor deseja fazer uma reserva, **When** seleciona obrigatoriamente uma de suas turmas vinculadas, um recurso e o período de data/horário, **Then** o sistema confirma a reserva se o recurso estiver ativo e disponível.
  - **Given** um recurso que já possui reserva no período selecionado, **When** o professor tenta reservar o mesmo recurso, **Then** o sistema impede a reserva devido a conflito de agenda (First-Come, First-Served).
  - **Given** a listagem de recursos para reserva, **Then** o sistema exibe apenas recursos que estejam marcados como "disponíveis" ou "ativos".

#### US11: Cancelar Reservas (Priority: P2)
Como professor, quero cancelar uma reserva existente para que o recurso fique livre para outros professores caso eu não vá mais utilizá-lo.
- **Why this priority**: Promove o uso eficiente dos recursos da instituição ao liberar horários não utilizados.
- **Independent Test**: O professor tenta cancelar reservas suas e valida que não consegue cancelar reservas de outros professores.
- **Acceptance Scenarios**:
  - **Given** que o professor visualiza a lista de suas reservas, **When** solicita o cancelamento de uma reserva de sua autoria, **Then** o sistema solicita uma confirmação e, após confirmada, o status do recurso muda instantaneamente para "disponível" no calendário.
  - **Given** a interface de reservas do sistema, **Then** o professor não tem permissão para cancelar reservas efetuadas por outros professores.

---

### 3. Aluno

#### US12: Autenticação do Aluno (Priority: P1)
Como aluno, quero realizar login no sistema para que eu possa acompanhar o cronograma de aulas nos laboratórios.
- **Why this priority**: Permite que alunos tenham acesso seguro e personalizado apenas às reservas relevantes às suas turmas.
- **Independent Test**: O aluno insere suas credenciais e valida se é direcionado à interface de consulta correta.
- **Acceptance Scenarios**:
  - **Given** a tela de login, **When** o aluno insere matrícula/e-mail e senha válidos, **Then** o sistema autentica com sucesso e direciona para a interface simplificada focada em consulta.

#### US13: Consultar Reservas (Aluno) (Priority: P2)
Como aluno, quero visualizar a lista de reservas de laboratórios e equipamentos das turmas em que estou matriculado para que eu saiba onde e com quais materiais minhas aulas ocorrerão.
- **Why this priority**: Acesso à informação de localização e recursos das aulas do aluno.
- **Independent Test**: O aluno logado visualiza a listagem e valida se ela é filtrada e somente leitura.
- **Acceptance Scenarios**:
  - **Given** que o aluno está logado no sistema, **Then** o aluno visualiza as reservas de forma estritamente somente leitura (sem permissão de criar, editar ou cancelar).
  - **Given** a listagem de reservas do aluno, **Then** a visualização é filtrada automaticamente para exibir apenas as reservas vinculadas às turmas em que o aluno possui vínculo no semestre ativo.

#### US14: Filtrar Consultas por Turma e/ou Data (Priority: P3)
Como aluno, quero filtrar a lista de reservas por turma e/ou por uma data específica para que eu possa encontrar rapidamente o local das minhas aulas sem precisar percorrer toda a lista.
- **Why this priority**: Melhora a usabilidade da consulta de reservas do aluno.
- **Independent Test**: O aluno aplica filtros individuais e combinados de turma e data.
- **Acceptance Scenarios**:
  - **Given** a tela de consulta do aluno, **When** seleciona uma de suas turmas ou escolhe uma data no calendário (ou ambas combinadas), **Then** o sistema exibe apenas as reservas correspondentes.
  - **Given** que o aluno acessa a consulta e nenhum filtro manual é aplicado, **Then** o sistema lista por padrão todas as reservas das turmas do aluno para a semana vigente.

#### US15: Visualização por Semestre Vigente (Priority: P3)
Como aluno, quero que a consulta de reservas seja restrita ao semestre atual por padrão para que eu não visualize dados irrelevantes de períodos letivos anteriores.
- **Why this priority**: Evita poluição visual e confusão com dados de períodos acadêmicos passados.
- **Independent Test**: O aluno acessa a tela e verifica se vê por padrão apenas o semestre atual, alternando para histórico apenas se desejar.
- **Acceptance Scenarios**:
  - **Given** que o aluno acessa a consulta de reservas, **Then** o sistema identifica automaticamente o semestre letivo vigente e filtra as turmas e reservas exibidas por ele.
  - **Given** a tela de consulta, **When** o aluno aciona a opção explícita de "Histórico", **Then** o sistema permite alternar e visualizar as reservas de semestres letivos anteriores.

### Edge Cases

- **Reserva com horários inválidos**: Tentativa de criar uma reserva onde a hora de término é anterior ou igual à hora de início. O sistema deve rejeitar o agendamento no domínio e exibir um erro.
- **Recurso inativado com reservas futuras**: Se um administrador desativar ou remover logicamente um recurso que possui reservas agendadas, o sistema deve tratar essas reservas (ex: alertar o administrador, cancelar as reservas futuras ou emitir notificações).
- **Semestre letivo sem datas definidas**: Quando o administrador cria uma turma sem definir um semestre letivo ativo correspondente às datas atuais do calendário.
- **Concorrência simultânea de reservas**: Dois professores tentam salvar uma reserva para o mesmo recurso no mesmo horário exatamente no mesmo instante. A persistência deve usar controle de concorrência para garantir que apenas um seja confirmado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST suportar autenticação e controle de acesso diferenciado para três perfis de usuários: Administrador, Professor e Aluno.
  - *Nota*: A autenticação e o dashboard do Aluno estão no escopo (já existentes/implementados no frontend), devendo-se garantir que os dados exibidos e os filtros de reservas/turmas vinculadas estejam corretos no painel de consultas do aluno.
- **FR-002**: O sistema MUST permitir que o Administrador consulte a visão global de reservas com filtros por nome do professor, nome do recurso, data específica ou semestre letivo (US03).
- **FR-003**: O sistema MUST permitir que o Administrador cadastre usuários vinculados aos perfis Admin, Professor ou Aluno, exigindo nome, matrícula/CPF e e-mail (US05).
- **FR-004**: O sistema MUST gerar uma senha temporária ou e-mail de boas-vindas no cadastro de um novo usuário (US05).
- **FR-005**: O sistema MUST permitir que o Administrador cadastre turmas informando nome ou código único e o semestre vigente (US06).
- **FR-006**: O sistema MUST permitir a vinculação de professor a turmas (1:N) e alunos a turmas (N:N) pelo administrador (US07).
- **FR-007**: O sistema MUST permitir ao Professor logado visualizar apenas as turmas vinculadas a ele (US08).
- **FR-008**: O sistema MUST permitir ao Professor consultar suas reservas, filtrando por período e tipo de recurso, exibindo a turma associada (US09).
- **FR-009**: O sistema MUST permitir ao Professor realizar reservas de recursos ativos associando a reserva obrigatoriamente a uma de suas turmas, validando conflitos de agenda (US10).
- **FR-010**: O sistema MUST permitir ao Professor cancelar suas próprias reservas mediante confirmação, alterando imediatamente a disponibilidade do recurso (US11).
- **FR-011**: O sistema MUST permitir ao Aluno visualizar a lista de reservas das turmas em que está matriculado de forma somente leitura (US13).
- **FR-012**: O sistema MUST permitir ao Aluno filtrar reservas por turma, data ou ambas combinadas, exibindo por padrão a semana vigente (US14).
- **FR-013**: O sistema MUST restringir a visualização padrão do Aluno ao semestre letivo vigente, permitindo acesso a semestres anteriores somente via histórico (US15).

### Key Entities

- **Usuário**: Pessoa cadastrada (Campos: ID, Nome, Matrícula/CPF, Email, Senha, Perfil/Role).
- **Turma**: Grupo de estudantes em um período acadêmico (Campos: ID, Nome/Código Único, Semestre Letivo, Professor Vinculado, Alunos Matriculados).
- **Reserva**: Agendamento de recurso (Campos: ID, Recurso, Turma, Professor Solicitante, Data, Hora de Início, Hora de Término, Status).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuários de qualquer perfil conseguem realizar login e visualizar suas respectivas áreas de trabalho (dashboard/consulta) em menos de 1.5 segundos após a submissão das credenciais.
- **SC-002**: 100% das tentativas de reservas concorrentes para o mesmo recurso e horário são validadas de forma que apenas o primeiro clique/solicitação seja aceito, retornando um erro imediato de conflito para os demais.
- **SC-003**: 100% dos dados exibidos na tela do aluno devem ser somente leitura, sem nenhuma requisição de alteração (POST/PUT/DELETE) exposta para o perfil de aluno no back-end.

## Assumptions

- O controle de semestres letivos e datas de vigência será gerenciado por datas de início e fim no cadastro de turmas ou configurações globais do sistema.
- A comunicação entre o front-end React e o back-end Java/Spring Boot persistirá utilizando o padrão REST/JSON.
- Alocações para eventos ou troca direta de recursos entre professores estão fora do escopo do sistema conforme definido na visão do produto.
