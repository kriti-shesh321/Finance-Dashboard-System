# Finance Dashboard Backend

A backend system for a finance dashboard with role-based access control, financial record management, and analytics APIs.

---

## Overview

This project demonstrates backend engineering fundamentals including: 
- API design and structuring 
- Role-based access control (RBAC) 
- Data modeling with relational databases 
- Aggregation and analytics endpoints 
- Validation and error handling

---

## Tech Stack

-   Node.js
-   Express.js
-   TypeScript
-   PostgreSQL
-   Prisma ORM
-   Zod (validation)
-   JWT (authentication)

---

## Setup Instructions

### 1. Clone the repository

``` bash
git clone https://github.com/kriti-shesh321/Finance-Dashboard-System.git
cd backend
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

``` env
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
```

### 4. Run database migrations

``` bash
npx prisma migrate dev
```

### 5. Seed initial data

``` bash
npx prisma db seed
```

Seeds: - 1 Admin (Rei Sora) - 2 Analysts - 3 Viewers

### 6. Start server

``` bash
npm run dev
```

---

## API Documentation

Detailed API design:

    docs/api-design.md

Postman Collection:

    postman_collection.json

---

## Authentication

-   JWT-based authentication
-   Token contains: `userId`, `role`
-   Passed via:

```
Authorization: Bearer <token>
```

---

## Roles & Permissions

  Role      Access
  --------- -------------------------------
  Viewer    Read-only access
  Analyst   Read + Create/Update records
  Admin     Full access (users + records)

---

## Features

### 1. User Management

-   Create users (Admin)
-   Update profile
-   Soft delete users
-   Filter users (status, deleted)

### 2. Financial Records

-   Create, update, delete (soft delete)
-   Restore deleted records
-   Filtering:
    -   type
    -   category
    -   date range
-   Pagination support

### 3. Dashboard APIs

-   Summary (income, expense, balance)
-   Category-wise totals
-   Trends (monthly/weekly)
-   Recent records

---

## Design Decisions

### 1. Soft Delete

-   Implemented using `deletedAt`
-   Preserves historical data
-   Allows restoration

### 2. RBAC via Middleware

-   Centralized access control

### 3. Validation with Zod

-   Request validation at middleware level

### 4. Prisma ORM

-   Type-safe queries
-   Easy migrations
-   Clean schema management

---

## Trade-offs & Limitations

-   Decimal values returned as strings (Prisma behavior)

---

## Testing

Use Postman collection:

    finance-dashboard.postman_collection.json

Login → token auto-saved → reuse across APIs

---

## Project Structure

    src/
      modules/
        auth/
        user/
        record/
        dashboard/
      middleware/
      config/
      types/

---

## Notes

* Database management and migrations are done using Prisma ORM.
* Seed script initializes test users for development.