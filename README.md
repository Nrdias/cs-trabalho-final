# SARC - Resource Allocation and Registration System

This is the **SARC** project, structured as a microservices ecosystem using Spring Boot + Spring Cloud on the backend, Keycloak authentication, PostgreSQL database, and a React SPA frontend.

---

## 🚀 How to Run the Project Locally

### 1. Prerequisites

Make sure you have the following installed on your machine:

* **Docker and Docker Compose**
* **Node.js** (version 18 or higher) with `npm`

---

### 2. Step-by-Step Execution Guide

#### Step 2.1: Build the Backend

Since your local Maven might not be in the PATH, run the build inside a temporary Docker container:

1. Open the terminal and navigate to the `backend` folder:
```bash
cd backend

```


2. Run the compilation command:
```bash
docker run -it --rm -v "$PWD":/usr/src/mymaven -v "$HOME/.m2":/root/.m2 -w /usr/src/mymaven maven:3.9-eclipse-temurin-21 mvn clean package -DskipTests

```



#### Step 2.2: Initialize Infrastructure Containers

Return to the repository root and start the containers via Docker Compose:

```bash
cd ..
docker-compose up -d --build

```

#### Step 2.3: Start the Frontend (React)

Navigate to the frontend folder, install dependencies, and start the development server:

```bash
cd frontend/sarc-web-react
npm install
npm run dev

```

---

## 🔗 Useful Links and Access URLs

| Service | Local URL | Description |
| --- | --- | --- |
| 💻 **Frontend Web App** | [http://localhost:5173](http://localhost:5173) | React interface for administrators, professors, and students. |
| 🛡️ **Keycloak Admin Console** | [http://localhost:8081](http://localhost:8081) | Keycloak authentication control panel (Realm / Users / Permissions). |
| 🔎 **Eureka Discovery Server** | [http://localhost:8761](http://localhost:8761) | Microservices dynamic registration dashboard. |
| ⚙️ **Spring Config Server** | [http://localhost:8888](http://localhost:8888) | Centralized configuration server. |
| 🚪 **API Gateway** | [http://localhost:8080](http://localhost:8080) | Single entry point for backend APIs. |

---

## 🔑 How to Create Accounts to Access SARC (Keycloak)

The application's login system is tied to the Keycloak realm named `sarc-realm`. Follow the steps below to create administrative, professor, or student accounts:

1. Access the **Keycloak** console: [http://localhost:8081](http://localhost:8081)
2. Log in using the Master Administrator credentials:
* **Username**: `admin`
* **Password**: `admin`


3. In the top-left corner, click the realm selector menu (where it says `master`) and select **`sarc-realm`**.
4. In the side menu, go to **Users** and click **Add user**.
5. Fill out the form (e.g., username `professor1`) and save.
6. Under the **Credentials** tab:
* Click **Set password**.
* Set a password (e.g., `123456`).
* **Uncheck** the "Temporary" option.
* Save and confirm.


7. Under the **Role mapping** tab:
* Click **Assign role**.
* Select the appropriate role:
* **`ADMIN`**: Allows managing resources, semesters, classes, and new users.
* **`PROFESSOR`**: Allows reserving rooms, laboratories, equipment, and canceling reservations.
* **`ALUNO`**: Read-only access to the schedule and allocation calendar.
8. You're all set! You can now use this account to log into the web portal at `localhost:5173`
