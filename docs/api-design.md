# Finance Dashboard Backend API

## Base URL

`/api/v1`

---

# Authentication

## POST /auth/login

Authenticate user and return JWT.

**Auth Required:** No

### Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "Kris Jane",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Status Codes

* 200 OK
* 401 Unauthorized

---

## POST /auth/register

Register a new user.

**Auth Required:** No

### Request

```json
{
  "name": "Kris Jane",
  "email": "user@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "id": "uuid",
  "name": "Kris Jane",
  "email": "user@example.com",
  "role": "viewer",
  "createdAt": "2026-04-03T10:00:00Z"
}
```

### Status Codes

* 201 Created
* 400 Bad Request

---

## GET /auth/me

Get current user details.

**Auth Required:** Yes

### Headers

```
Authorization: Bearer <token>
```

### Response

```json
{
  "id": "uuid",
  "name": "Kris Jane",
  "email": "user@example.com",
  "role": "viewer",
  "createdAt": "2026-04-03T10:00:00Z"
}
```

---

# Users

## POST /users

Create a new user (Admin only)

**Auth Required:** Yes
**Allowed Role:** Admin

### Request

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "analyst",
  "status": true
}
```

### Response

```json
{
  "id": "uuid",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "analyst",
  "status": true,
  "createdAt": "2026-04-03T10:00:00Z"
}
```

---

## GET /users

Get list of users (Admin only)

**Auth Required:** Yes
**Allowed Role:** Admin

### Query Params

* page (number)
* limit (number)
* status (active | inactive | all)

### Response

```json
{
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": "uuid",
      "name": "Kris Jane",
      "email": "user@example.com",
      "role": "viewer",
      "status": true,
      "createdAt": "2026-04-03T10:00:00Z"
    }
  ]
}
```

---

## PATCH /users/:id

Update user details

**Auth Required:** Yes

### Request

```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

### Response

```json
{
  "message": "User updated successfully",
  "user": {
    "id": "uuid",
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "viewer",
    "status": true,
    "updatedAt": "2026-04-03T11:00:00Z"
  }
}
```

---

## PATCH /users/:id/status

Update user status (Admin only)

### Request

```json
{
  "status": false
}
```

---

## DELETE /users/:id

Delete user (Admin only)

### Response

```json
{
  "message": "User deleted successfully"
}
```

---

# Records

## POST /records

Create a financial record

**Auth Required:** Yes

### Request

```json
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "notes": "Monthly salary",
  "date": "2026-04-01T00:00:00Z"
}
```

### Response

```json
{
  "id": "uuid",
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "notes": "Monthly salary",
  "date": "2026-04-01T00:00:00Z",
  "createdAt": "2026-04-03T10:00:00Z"
}
```

---

## GET /records

Get records

### Query Params

* page
* limit
* type
* category
* startDate
* endDate

### Response

```json
{
  "page": 1,
  "limit": 10,
  "count": 10,
  "data": [
    {
      "id": "uuid",
      "amount": 5000,
      "type": "income",
      "category": "salary",
      "date": "2026-04-01T00:00:00Z"
    }
  ]
}
```

---

## PATCH /records/:id

Update record

---

## DELETE /records/:id

Soft delete record

---

## PATCH /records/:id/restore

Restore deleted record

---

# Dashboard

## GET /dashboard/summary

### Response

```json
{
  "totalIncome": 10000,
  "totalExpense": 4000,
  "netBalance": 6000
}
```

---

## GET /dashboard/category-totals

### Response

```json
[
  {
    "category": "salary",
    "totalIncome": 10000,
    "totalExpense": 0,
    "balance": 10000
  },
  {
    "category": "food",
    "totalIncome": 0,
    "totalExpense": 2000,
    "balance": -2000
  }
]
```

---

## GET /dashboard/trends

### Query Params

* period

### Response

```json
[
  { "period": "2026-03", "income": 5000, "expense": 3000 },
  { "period": "2026-04", "income": 7000, "expense": 4000 }
]
```

---

## GET /dashboard/recent

### Response

```json
[
  {
    "id": "uuid",
    "amount": 500,
    "type": "expense",
    "category": "food",
    "date": "2026-04-01T00:00:00Z"
  }
]
```

---

# Notes

* All endpoints (except auth) require JWT authentication
* Role-based access control is enforced
* Soft delete uses `deletedAt`
* Pagination supported on list endpoints