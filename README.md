<div align="center">

# 🗳️ eVote

**A modern, secure electronic voting platform.**

eVote allows administrators to create elections, invite voters via unique tokens, and consult results — all through a clean, secure web interface.

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular&logoColor=white)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Persistence-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-blue)]()
[![Status](https://img.shields.io/badge/Status-In_Development-orange)]()

</div>

---

## 📖 Overview

eVote is a full-stack web application for managing secure electronic elections. An administrator creates an election with a title, description, dates, and voting options, then generates unique tokens for each invited voter. Voters access the election through a private link and cast a single, immutable vote. Results are available to the administrator in real time.

---

## ✨ Features

### 👤 Authenticated Administrator
- Create elections with title, description, date range, and voting options
- Generate unique tokens for each voter
- Track participation (voter count vs. votes cast)
- View results per election

### 🗳️ Voter
- Access an election through a unique private link / token
- Cast a single vote — non-editable after submission

### 🔐 Security
- JWT-based authentication
- Role-based access control (ADMIN / USER)
- Angular Route Guards and HTTP Interceptor

---

## 🏗️ Architecture

```mermaid
graph TD
    Voter[Voter\nUnique token link]
    Admin[Administrator\nAuthenticated]

    subgraph Frontend [Angular 17 Frontend]
        AuthModule[Auth Module\nLogin / Register]
        AdminDashboard[Admin Dashboard\nElections + Tokens]
        VoterView[Voter View\nQuiz Player]
    end

    subgraph Backend [Spring Boot Backend]
        API[REST API Layer]
        Security[Spring Security\nJWT Filter]
        Service[Service Layer]
        Repo[Repository Layer\nSpring Data JPA]
    end

    PG[(PostgreSQL)]

    Admin --> AuthModule
    Admin --> AdminDashboard
    Voter --> VoterView
    Frontend --> API
    API --> Security
    Security --> Service
    Service --> Repo
    Repo --> PG
```

---

## 🔄 Core Flows

### Election Creation & Voter Invitation

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant Backend
    participant DB as PostgreSQL

    Admin->>Frontend: Login (email + password)
    Frontend->>Backend: POST /api/auth/login
    Backend->>Frontend: JWT token

    Admin->>Frontend: Create election (title, options, dates)
    Frontend->>Backend: POST /api/elections
    Backend->>DB: Persist election

    Admin->>Frontend: Generate voter tokens
    Frontend->>Backend: POST /api/elections/{id}/tokens
    Backend->>DB: Persist tokens
    Backend->>Frontend: Token list (shareable links)
```

### Voting Flow

```mermaid
sequenceDiagram
    participant Voter
    participant Frontend
    participant Backend
    participant DB as PostgreSQL

    Voter->>Frontend: Open unique link (/vote?token=xxx)
    Frontend->>Backend: GET /api/elections/token/{token}
    Backend->>DB: Validate token + fetch election
    Backend->>Frontend: Election details

    Voter->>Frontend: Select option + submit
    Frontend->>Backend: POST /api/votes (token + choice)
    Backend->>DB: Persist vote, mark token as used
    Backend->>Frontend: Confirmation

    Frontend->>Voter: Vote confirmed — cannot be changed
```

---

## 🔐 Authentication

eVote uses stateless **JWT authentication** with role-based access control.

```mermaid
sequenceDiagram
    participant Client
    participant Backend
    participant JWTFilter

    Client->>Backend: POST /api/auth/login (email + password)
    Backend->>Client: JWT token

    Client->>Backend: Protected request + Bearer token
    Backend->>JWTFilter: Validate token signature + expiry
    JWTFilter->>Backend: Authenticated principal + roles
    Backend->>Client: Protected resource
```

- Token stored in **localStorage** on the frontend
- **HTTP Interceptor** automatically injects the `Authorization: Bearer` header
- **Route Guards** block access to protected Angular routes
- Roles: `ADMIN` (full access) · `USER` (voter-facing views)

---

## 📐 Data Models

```mermaid
erDiagram
    USER {
        Long id
        String email
        String password
        String role
    }

    ELECTION {
        Long id
        String title
        String description
        LocalDate startDate
        LocalDate endDate
        Long createdBy
    }

    OPTION {
        Long id
        String label
        Long electionId
    }

    VOTER_TOKEN {
        Long id
        String token
        Boolean used
        Long electionId
    }

    VOTE {
        Long id
        Long electionId
        Long optionId
        Long tokenId
        LocalDateTime castAt
    }

    USER ||--o{ ELECTION : creates
    ELECTION ||--o{ OPTION : has
    ELECTION ||--o{ VOTER_TOKEN : generates
    ELECTION ||--o{ VOTE : receives
    OPTION ||--o{ VOTE : receives
    VOTER_TOKEN ||--|| VOTE : linked_to
```

---

## 🛠️ Technology Stack

### Backend
| Technology | Role |
|---|---|
| Java 17+ | Runtime |
| Spring Boot 3+ | Application framework |
| Spring Security | JWT authentication + role enforcement |
| Spring Data JPA | Data access layer |
| MapStruct | DTO mapping |
| PostgreSQL | Relational database |
| Maven | Build tool |

### Frontend
| Technology | Role |
|---|---|
| Angular 17 (standalone) | SPA framework |
| Bootstrap 5 | UI components and layout |
| Angular Router + Guards | Navigation and access control |
| HTTP Interceptor | Automatic token injection |
| LocalStorage | JWT token storage |

---

## 🚀 Getting Started

### Prerequisites

- [Java 17+](https://openjdk.org/)
- [Maven](https://maven.apache.org/)
- [Node.js 18+ + Angular CLI](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Backend

**1. Configure the database and JWT secret**

Create `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/evote
spring.datasource.username=postgres
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=your_jwt_secret
jwt.expiration=86400000
```

**2. Run the backend**

```bash
cd evote-backend
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

### Frontend

**1. Install dependencies**

```bash
cd evote-frontend
npm install
```

**2. Start the dev server**

```bash
ng serve
```

The app will be available at `http://localhost:4200`.

---

## 🔗 API Endpoints

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `POST` | `/api/elections` | ADMIN | Create an election |
| `GET` | `/api/elections` | ADMIN | List all elections |
| `POST` | `/api/elections/{id}/tokens` | ADMIN | Generate voter tokens |
| `GET` | `/api/elections/token/{token}` | Public | Access election by token |
| `POST` | `/api/votes` | Public | Cast a vote |
| `GET` | `/api/elections/{id}/results` | ADMIN | View results |

---

## 🧪 Testing

- Unit tests on service and business logic layers
- Integration tests on critical endpoints (auth, voting, result retrieval)
- Token uniqueness and single-vote enforcement validated on the backend

---

## 🛣️ Roadmap

- [ ] Email / SMS delivery of voter tokens
- [ ] Dedicated admin interface with advanced controls
- [ ] Result charts (bar / pie) per election
- [ ] Election status management (draft, open, closed)
- [ ] Audit log for votes and admin actions
- [ ] Docker Compose setup for one-command startup

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and share with attribution. See the [LICENSE](LICENSE) file for details.
