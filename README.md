# 🗳️ eVote - Application de vote électronique

![Page d'accueil]('./evote-frontend/src/assets/images/evote.png')
eVote est une plateforme web moderne de vote électronique permettant à un administrateur de créer des élections, inviter des votants via des tokens uniques, et consulter les résultats en toute sécurité.

---

## 🌐 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Architecture](#-architecture)
- [Installation Backend (Spring Boot)](#-installation-backend-spring-boot)
- [Installation Frontend (Angular 17)](#-installation-frontend-angular-17)
- [Authentification](#-authentification)
- [Modèles de données](#-modèles-de-données)
- [Aperçu](#-aperçu)
- [TODO](#-todo)
- [Licence](#-licence)

---

## ✅ Fonctionnalités

### 👤 Utilisateur Authentifié
- Création d’une élection avec titre, description, dates, options
- Génération de tokens pour les votants
- Suivi du nombre de votants et de votes
- Visualisation des résultats

### 🗳️ Votant
- Accès à l’élection via un lien unique/token
- Vote unique non modifiable

### 🔐 Sécurité
- Authentification via JWT
- Rôles (ADMIN / USER)
- Guard Angular + Interceptor HTTP

---

## 🛠️ Stack Technique

### Backend (Spring Boot)
- Java 17
- Spring Boot 3+
- Spring Security (JWT)
- Spring Data JPA
- MapStruct (DTO mapping)
- PostgreSQL
- Maven

### Frontend (Angular)
- Angular 17 standalone
- Bootstrap 5
- Angular Router, Forms, Guards, Interceptors
- LocalStorage pour la gestion du token JWT

---

## 🚀 Installation Backend (Spring Boot)

### 1. Prérequis
- Java 17
- Maven
- PostgreSQL

### 2. Configuration

Crée un fichier `application.properties` :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/evote
spring.datasource.username=postgres
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=your_jwt_secret
jwt.expiration=86400000
```
### 3. Lancer le projet
```
cd evote-backend
./mvnw spring-boot:run
```



## 💻 Installation Frontend (Angular 17)
### 1. Prérequis
Node.js 18+
Angular CLI

### 2. Installation
```
cd evote-frontend
npm install
```

### 3. Lancer l’application
```
ng serve
```

## 🔐 Authentification

Enregistrement (/api/auth/register)

Connexion (/api/auth/login) → retourne un JWT

Token stocké dans localStorage côté client

Interceptor Angular ajoute le token dans Authorization automatiquement


## 📌 TODO

 - Envoi de tokens par email/SMS

 - Interface admin dédiée

 - Charts de résultats

## 📄 Licence
Ce projet est sous licence MIT.
Libre à vous de l'utiliser, modifier et partager, avec attribution.

A brief description of what this project does and who it's for