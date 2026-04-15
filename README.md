# CrimsonTurque
Full-stack web app built with React (SPA) and Node.js. Features authentication, role-based access (guest, client, admin), CRUD operations, pagination, and i18n (PL/EN). Designed under constraint of using only 3 database tables.


## Features

- User authentication (login & registration)
- Role-based access control:
  - Guest
  - Client
  - Admin
- CRUD operations for all main entities
- Pagination for list views
- Detailed views with relational data
- Client-side and server-side validation
- Internationalization (Polish / English)

---

## Database

- Uses **3 tables only**
- Includes **many-to-many relationship** with additional attribute
- SQL scripts included:
  - `schema.sql` – database structure
  - `seed.sql` – sample data

---

## Tech Stack

- Frontend: React (SPA)
- Backend: Node.js + Express
- Database: MySQL / MongoDB

---

## How to Run

The application requires **two terminal windows** — one for the backend, one for the frontend.

>  In IntelliJ IDEA / WebStorm, open a new terminal with `Ctrl + Shift + T`

---

### 1. Install Dependencies

Navigate to each directory and run:

```bash
npm install
```

> **Note:** If `npm install` fails in the frontend directory, use:
> ```bash
> npm install --legacy-peer-deps
> ```
> This is required due to the i18n library's dependency on a newer TypeScript version.

---

### 2. Start the Application

**Terminal 1 — Backend:**

```bash
cd backend
npm start
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm start
```

>  Always start the **backend first**, then the frontend.

## Access Control

| Role    | Permissions                                      |
|---------|--------------------------------------------------|
| Guest   | Limited access (read-only)                       |
| Client  | Access only to their own data                    |
| Admin   | Full access to all resources and management features |

---

## Internationalization

The application supports two languages:

- 🇵🇱 **Polish (PL)**
- 🇬🇧 **English (EN)**

Users can switch between languages directly in the interface.

---

## Project Notes

- Developed as an **academic project**
- Built **without** scaffolding generators
- No code copied from tutorials
- Designed under strict database constraints — **3 tables only**

## Additional Information

- ✅ All main entities support full **CRUD** operations
- ✅ Data validation implemented on both **client and server** side
- ✅ **Pagination** used for better performance with large datasets
