# SARC - Sistema de Alocação de Recursos e Cadastros

Este é o projeto **SARC**, estruturado como um ecossistema de microsserviços em Spring Boot + Spring Cloud no backend, com autenticação Keycloak, banco de dados PostgreSQL e um frontend SPA desenvolvido em React.

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
Certifique-se de possuir instalado em sua máquina:
* **Docker e Docker Compose**
* **Node.js** (versão 18 ou superior) com `npm`

---

### 2. Passo a Passo de Execução

#### Passo 2.1: Compilar o Backend
Como o Maven local pode não estar no PATH, execute o build compilando dentro de um container Docker temporário:

1. Abra o terminal e navegue até a pasta `backend`:
   ```bash
   cd backend
   ```
2. Execute o comando de compilação:
   ```bash
   docker run -it --rm -v "$PWD":/usr/src/mymaven -v "$HOME/.m2":/root/.m2 -w /usr/src/mymaven maven:3.9-eclipse-temurin-21 mvn clean package -DskipTests
   ```

#### Passo 2.2: Inicializar os Containers de Infraestrutura
Retorne para a raiz do repositório e inicie os containers via Docker Compose:
```bash
cd ..
docker-compose up -d --build
```

#### Passo 2.3: Iniciar o Frontend (React)
Navegue até a pasta do frontend, instale as dependências e inicie o servidor de desenvolvimento:
```bash
cd frontend/sarc-web-react
npm install
npm run dev
```

---

## 🔗 Links Úteis e Endereços de Acesso

| Serviço | URL Local | Descrição |
| :--- | :--- | :--- |
| 💻 **Frontend Web App** | [http://localhost:5173](http://localhost:5173) | Interface em React para administradores, professores e alunos. |
| 🛡️ **Keycloak Admin Console** | [http://localhost:8081](http://localhost:8081) | Painel de controle de autenticação do Keycloak (Realm / Usuários / Permissões). |
| 🔎 **Eureka Discovery Server** | [http://localhost:8761](http://localhost:8761) | Painel de registro dinâmico dos microsserviços. |
| ⚙️ **Spring Config Server** | [http://localhost:8888](http://localhost:8888) | Servidor central de configurações. |
| 🚪 **API Gateway** | [http://localhost:8080](http://localhost:8080) | Ponto único de entrada para as APIs de backend. |

---

## 🔑 Como criar contas para acessar o SARC (Keycloak)

O sistema de login da aplicação está associado ao realm do Keycloak chamado `sarc-realm`. Siga as etapas abaixo para criar contas administrativas, de professores ou alunos:

1. Acesse o console do **Keycloak**: [http://localhost:8081](http://localhost:8081)
2. Faça login com as credenciais do Administrador Geral:
   * **Usuário**: `admin`
   * **Senha**: `admin`
3. No canto superior esquerdo, clique no menu seletor de Realm (onde diz `master`) e selecione o **`sarc-realm`**.
4. No menu lateral, acesse **Users** (Usuários) e clique em **Add user** (Criar usuário).
5. Preencha o formulário (ex: usuário `professor1`) e salve.
6. Na aba **Credentials** (Credenciais):
   * Clique em **Set password** (Definir senha).
   * Defina uma senha (ex: `123456`).
   * **Desmarque** a opção "Temporary" (Temporária).
   * Salve e confirme.
7. Na aba **Role mapping** (Mapeamento de papéis):
   * Clique em **Assign role** (Atribuir papel).
   * Selecione o papel apropriado:
     * **`ADMIN`**: Permite gerenciar recursos, semestres, turmas e novos usuários.
     * **`PROFESSOR`**: Permite reservar salas, laboratórios, equipamentos e cancelar reservas.
     * **`ALUNO`**: Acesso somente leitura para cronograma e calendário de alocações.
8. Pronto! Agora você pode usar essa conta para logar no portal web `http://localhost:5173`.
