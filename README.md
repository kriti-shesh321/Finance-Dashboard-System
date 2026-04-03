# Finance Dashboard Backend

Backend system for a finance dashboard with role-based access control, financial record management, and analytics APIs.

---

## Tech Stack

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/kriti-shesh321/Finance-Dashboard-System.git
cd backend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file:

```env
PORT=your_port
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
```

---

### 4. Run database migrations

```bash
npx prisma migrate dev
```

---

### 5. Seed initial data

```bash
npx prisma db seed
```

This will create:

* 1 Admin
* 2 Analysts
* 3 Viewers

---

### 6. Start the server

```bash
npm run dev
```

---

## API Documentation

Detailed API documentation is available here:

`docs/api-design.md`

---

## Features

* Role-based access control (Viewer, Analyst, Admin)
* Financial record management (CRUD + filtering)
* Dashboard analytics (summary, category, trends)
* JWT-based authentication
* Soft delete support

---

## Notes

* Prisma ORM is used for database management and migrations
* Seed script initializes test users for development