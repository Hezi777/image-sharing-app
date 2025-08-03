# Image Sharing App

**A full-stack image sharing platform powered by React, NestJS, and PostgreSQL.**

&#x20;        &#x20;

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Running the App](#running-the-app)
- [Folder Structure](#folder-structure)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

- **Image Upload** with client-side preview prior to submission
- **Gallery View** displaying all uploaded images
- **Like & Comment** functionality on images
- **RESTful API** endpoints for upload, retrieval, like, and comment operations
- **Local Storage** of image files in `uploads/` folder
- **PostgreSQL** database for metadata (likes, comments, filenames, URLs)

---

## Project Structure

```
root/
├── backend/        # NestJS server (TypeScript)
├── frontend/       # React app (TypeScript + MUI)
└── README.md       # Project overview and setup instructions
```

---

## Setup and Installation

### Backend

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL connection string
4. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```
5. **Start the server**
   ```bash
   npm run start:dev
   ```

### Frontend

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the development server**
   ```bash
   npm start
   ```

---

## Running the App

1. Ensure PostgreSQL is running and the backend database is migrated.
2. In one terminal, start the backend:
   ```bash
   cd backend
   npm run start:dev
   ```
3. In another terminal, start the frontend:
   ```bash
   cd frontend
   npm start
   ```
4. Open your browser at `http://localhost:3000` to view the app.

---

## Folder Structure

- **backend/**: NestJS application
  - `src/` – route controllers, services, modules
  - `uploads/` – stored image files
  - `prisma/` – schema & migrations
- **frontend/**: React application
  - `src/` – components, pages, API client via Axios
  - `public/` – static assets, `index.html`

---

## Screenshots

> *Add your screenshots to **``** and update the paths below.*

| Gallery View | Upload Form |
| ------------ | ----------- |
|              |             |

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

