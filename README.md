# MarketKosova 🛒

A full-stack marketplace web application built with **Next.js**, **Spring Boot**, and **MySQL**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------:|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, Axios |
| Backend | Java 21, Spring Boot 3.2, Spring Security, JWT |
| Database | MySQL 8+ |
| Build | Maven (backend), npm (frontend) |

---

## Prerequisites

- **Java 21** (JDK)
- **Node.js 18+** & npm
- **MySQL 8+** running locally

---

## Quick Start

### 1. Database Setup

```sql
CREATE DATABASE marketkosova;
```

> Default credentials in `application.properties`: `root` / `root`
> Update if your MySQL uses different credentials.

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

- Runs on **http://localhost:8080**
- Auto-creates tables via Hibernate `ddl-auto=update`
- Seeds 7 default categories on first run

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

- Runs on **http://localhost:3000**

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login (returns JWT) |
| GET | `/api/listings` | — | All listings |
| GET | `/api/listings/{id}` | — | Single listing |
| GET | `/api/listings/my` | USER | My listings |
| POST | `/api/listings` | USER | Create (multipart) |
| PUT | `/api/listings/{id}` | OWNER | Update (multipart) |
| DELETE | `/api/listings/{id}` | OWNER/ADMIN | Delete |
| GET | `/api/categories` | — | All categories |
| GET | `/api/admin/users` | ADMIN | All users |
| DELETE | `/api/admin/listings/{id}` | ADMIN | Force delete |

**Query params on GET `/api/listings`:**
- `?search=query` — text search
- `?categoryId=1` — filter by category

---

## Project Structure

```
MarketKosova/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/marketkosova/
│       ├── entity/       User, Listing, Category, Role
│       ├── repository/   JPA repositories
│       ├── dto/          Request/Response DTOs
│       ├── service/      Business logic
│       ├── controller/   REST endpoints
│       ├── security/     JWT, Spring Security config
│       ├── config/       CORS, DataSeeder
│       └── exception/    Global error handler
├── frontend/
│   ├── app/              Next.js App Router pages
│   ├── components/       Navbar, Footer, ListingCard
│   ├── context/          AuthContext
│   └── lib/              Axios client, TypeScript types
└── uploads/              Local image storage
```

---

## Features

- ✅ User registration & login with JWT
- ✅ Password hashing (BCrypt)
- ✅ Role-based access (USER, ADMIN)
- ✅ CRUD listings with image upload
- ✅ Ownership-based edit/delete protection
- ✅ Search & category filtering
- ✅ Admin dashboard (manage users & listings)
- ✅ Responsive dark-theme UI
- ✅ Loading skeletons & animations

---

## Database Schema

```sql
users    (id, username, email, password, role, created_at)
categories (id, name)
listings (id, title, description, price, location, image, created_at, user_id, category_id)
```

Full schema file: `backend/src/main/resources/schema.sql`

---

## Notes

- Images stored locally in `./uploads/` folder
- JWT token expires after 24 hours
- Max file upload size: 5MB
- Default categories: Electronics, Vehicles, Real Estate, Clothing, Furniture, Services, Other
- To make a user admin: `UPDATE users SET role='ADMIN' WHERE username='youruser';`
