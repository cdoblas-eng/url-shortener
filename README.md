# URL Shortener Service

[![Java Version](https://img.shields.io/badge/Java-25-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Architecture](https://img.shields.io/badge/Architecture-Hexagonal%20%2F%20Ports%20%26%20Adapters-blue.svg)](#architecture)
[![Build & SonarQube](https://github.com/cdoblas-eng/url-shortener/actions/workflows/ci.yml/badge.svg)](https://github.com/cdoblas-eng/url-shortener/actions/workflows/ci.yml)

A high-performance, scalable, and resilient **URL Shortener Microservice** built with modern **Java 25** and **Spring Boot 4**. Designed using **Hexagonal Architecture (Ports & Adapters)**, this application provides ultra-fast URL redirection, multi-tier caching with Redis, asynchronous analytics streaming with Apache Kafka, and relational persistence with PostgreSQL.

---

## 🎯 Purpose & Features

- **URL Shortening**: Generates compact, collision-resistant unique short codes for long URLs.
- **Ultra-Fast Redirection**: Optimized read paths utilizing Redis in-memory caching for minimal latency redirection.
- **Asynchronous Event-Driven Analytics**: Uses Apache Kafka to publish click and redirection events asynchronously without blocking HTTP response times.
- **Real-Time Click Analytics**: Aggregates redirection metrics, total click counts, and access statistics.
- **Clean Architecture**: Decouples core domain business logic from external frameworks, databases, and transport layers.
- **Automated CI/CD & Code Quality**: Continuous Integration pipeline with GitHub Actions, Testcontainers integration testing, JaCoCo code coverage, and SonarQube static code analysis.

---

## 🏗️ Architecture

The project strictly follows **Hexagonal Architecture (Ports & Adapters)** to enforce separation of concerns, testability, and maintainability:

```text
src/main/java/com/example/urlshortener/
├── domain/                  # Core Business Domain (No framework dependencies)
│   ├── model/               # Aggregates, Entities, and Value Objects (e.g., ShortUrl)
│   └── exception/           # Domain-specific exceptions
├── application/             # Application Use Cases & Ports
│   ├── port/                # Driving (Input) & Driven (Output) Ports
│   │   ├── in/              # Use Case interfaces (e.g., ShortenUrlUseCase)
│   │   └── out/             # Repository & Messaging interfaces
│   └── service/             # Application Services implementing use cases
└── infrastructure/          # Adapters & Technical Configuration
    ├── adapter/
    │   ├── in/web/          # REST Controllers & DTOs
    │   └── out/             # Persistence (JPA), Cache (Redis), Events (Kafka)
    └── config/              # Spring configurations (Redis, Kafka, Database)
```

---

## 🛠️ Technology Stack

| Category | Technology | Description |
|---|---|---|
| **Language** | **Java 25** | Latest Java LTS platform features & virtual threads. |
| **Framework** | **Spring Boot 4.1.0** | Core application framework (Spring Web, JPA, Cache, Kafka, Actuator). |
| **Database** | **PostgreSQL** | Primary relational datastore for persistent URL mappings. |
| **Cache Layer** | **Redis** | In-memory key-value cache for ultra-fast redirection lookups. |
| **Messaging** | **Apache Kafka** | Distributed event streaming for asynchronous access analytics. |
| **Integration Testing** | **Testcontainers** | Isolated Docker containers for PostgreSQL and Kafka during automated test suites. |
| **Code Quality** | **SonarQube & JaCoCo** | Static code analysis, security scanning, and test coverage reporting. |
| **Formatting** | **Spotless** | Automated code style and formatting enforcement. |
| **Containerization** | **Docker & Docker Compose** | Local service orchestration for database, cache, and messaging infrastructure. |
| **CI/CD** | **GitHub Actions** | Automated build, test execution, and SonarQube code scanning on every push. |

---

## 🚀 Getting Started

### Prerequisites

- **Java 25 JDK**
- **Maven 3.9+**
- **Docker & Docker Compose**

### Running Infrastructure Locally

Start PostgreSQL, Redis, and Kafka using Docker Compose:

```bash
docker-compose up -d
```

### Running the Application

Execute the application locally with Maven:

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`.

---

## 🧪 Testing & Quality Assurance

### Run Unit & Integration Tests

Run the complete test suite utilizing **Testcontainers** for real PostgreSQL and Kafka instances:

```bash
mvn clean verify
```

### Run Spotless Formatting Check

```bash
mvn spotless:check
# To apply automatic formatting:
mvn spotless:apply
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/urls/shorten` | Shorten a target URL. Returns short code & shortened URL. |
| `GET` | `/{shortCode}` | Redirect (HTTP 302/301) to the destination long URL. |
| `GET` | `/api/v1/urls/{shortCode}/stats` | Retrieve access statistics and total click counts. |
| `GET` | `/actuator/health` | Application health and infrastructure component status. |

---

## 🔄 CI/CD & SonarQube Integration

Every push and Pull Request to `main` triggers a GitHub Actions pipeline (`.github/workflows/ci.yml`) that performs:

1. **Checkout & JDK 25 Setup**
2. **Build & Automated Verification** (`mvn clean verify` with JaCoCo test coverage)
3. **SonarQube Static Analysis** against the hosted SonarQube server (`http://178.18.245.9:9000`)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
