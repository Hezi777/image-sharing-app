# IMAGE-SHARING-APP

<p align="center"><strong>Built with the tools and technologies:</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/JSON-black?logo=json&logoColor=white" />
  <img src="https://img.shields.io/badge/Markdown-black?logo=markdown&logoColor=white" />
  <img src="https://img.shields.io/badge/npm-red?logo=npm&logoColor=white" />
  <img src="https://img.shields.io/badge/Prettier-yellow?logo=prettier&logoColor=black" />
  <img src="https://img.shields.io/badge/JavaScript-yellow?logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/tsnode-informational?logo=ts-node" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?logo=axios" />
  <img src="https://img.shields.io/badge/Jest-C21325?logo=jest" />
</p>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
  - [Development](#development)
  - [Production](#production)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

A modern, full-stack image gallery inspired by Instagram, allowing users to upload images, view them in a dynamic feed, like them, and add comments. Built with React and NestJS, the app features real-time updates and an intuitive interface.

Images are stored locally and metadata is managed in a PostgreSQL database using Prisma ORM.

---

## Tech Stack

| Layer    | Technology                                                   |
| -------- | ------------------------------------------------------------ |
| Frontend | React 19, TypeScript, Material‑UI (MUI), React Router, Axios |
| Backend  | NestJS 9, TypeScript, Prisma ORM, PostgreSQL, Multer         |
| Database | PostgreSQL 14 with Prisma migrations                         |
| Storage  | Local filesystem (`uploads/` folder)                         |

---

## Features

- **Image Upload** with drag-and-drop, preview, and validation
- **Gallery Feed** with image metadata and infinite scroll
- **Like & Comment** with optimistic UI updates
- **Responsive Design** via MUI
- **RESTful API** for interaction with the backend
- **Local Storage** for images and PostgreSQL for structured metadata

---

## Project Structure

```
root/
├── backend/        # NestJS server
│   ├── src/        # Controllers, services, modules
│   ├── uploads/    # Stored image files
│   └── prisma/     # Schema & migration files
├── frontend/       # React application
│   ├── src/        # Components, pages, hooks, API client
│   ├── public/     # Static assets and index.html
└── README.md       # This documentation
```

---

## Prerequisites

- Node.js 16+
- PostgreSQL 14+
- Git

---

## Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env  # or manually create .env
# configure DATABASE_URL in .env
npx prisma migrate dev --name init
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
# configure API endpoint in .env
npm start
```

---

## Environment Configuration

### Backend `.env`

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3001
UPLOAD_DIR=./uploads
```

### Frontend `.env`

```dotenv
REACT_APP_API_URL=http://localhost:3001/api
```

---

## Database Setup

```bash
npx prisma generate
npx prisma migrate deploy
```

---

## Running the Application

### Development

```bash
# Terminal 1
cd backend && npm run start:dev

# Terminal 2
cd frontend && npm start
```

### Production

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
serve -s build
```

---

## API Documentation

| Method | Endpoint              | Description                       |
| ------ | --------------------- | --------------------------------- |
| POST   | `/images/upload`      | Upload a new image                |
| GET    | `/images`             | Retrieve all images with comments |
| POST   | `/images/:id/like`    | Like or unlike an image           |
| POST   | `/images/:id/comment` | Add a comment to an image         |

---

## Database Schema

```prisma
model Image {
  id           Int       @id @default(autoincrement())
  filename     String
  originalName String
  url          String
  createdAt    DateTime  @default(now())
  likes        Int       @default(0)
  comments     Comment[]
}

model Comment {
  id         Int      @id @default(autoincrement())
  imageId    Int
  text       String
  createdAt  DateTime @default(now())
  image      Image    @relation(fields: [imageId], references: [id])
}
```

---

## Screenshots

> *Add screenshots to **`frontend/public/screenshots/`** and update paths.*

| Gallery View | Upload Form |
| ------------ | ----------- |
|              |             |

---

## Contributing

1. Fork the repo
2. Create a new branch (`git checkout -b feature/some-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to your fork (`git push origin feature/some-feature`)
5. Open a Pull Request

---

## License

Licensed under the [MIT License](./LICENSE).

