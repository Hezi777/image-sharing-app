<h1 align="center">
  <img width="300" height="300" alt="Lumia Logo" src="https://github.com/user-attachments/assets/cea168b5-247e-46c7-a645-c8a91cef2ef5" />
  <br/>
  <b>Lumia — Image Sharing App</b>
</h1>

<p align="center">
  A clean, full-stack photo-sharing platform inspired by Instagram.<br/>
  Upload photos, browse a responsive gallery, and like & comment in real time.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/NestJS-9-E0234E?logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql" />
  <img src="https://img.shields.io/badge/Material--UI-007FFF?logo=mui&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/Hezi777/image-sharing-app?style=for-the-badge" />
  <img src="https://img.shields.io/github/issues/Hezi777/image-sharing-app?style=for-the-badge" />
  <img src="https://img.shields.io/github/issues-pr/Hezi777/image-sharing-app?style=for-the-badge" />
</p>

---

## ✨ Features

- 📤 **Image Upload** — drag-and-drop with preview & validation  
- 🖼 **Responsive Gallery** — infinite scroll & image metadata  
- ❤️ **Likes & Comments** — real-time optimistic updates  
- 📱 **Mobile-First Design** — works seamlessly on any device  
- 🔌 **REST API** — structured and documented for easy integration  

---
## 📸 Screenshots

Below are some highlights of Lumia in action.  
*(Demo content generated with sample travel and lifestyle images for presentation purposes.)*

| Home (Infinite Scroll) | Image Upload |
|------------------------|--------------|
| ![Home Gallery](assets/screenshots/home.gif) | ![Upload Page](assets/screenshots/upload.png) |

| Login Page | Registration Page |
|------------|-------------------|
| ![Login](assets/screenshots/login.png) | ![Register](assets/screenshots/register.png) |

| Profile Page | Dark Mode |
|--------------|-----------|
| ![Profile](assets/screenshots/profile.png) | ![Dark Mode](assets/screenshots/darkmode.png) |

---

### **Screenshot Details**
1. **Home (Infinite Scroll)** — GIF showing images loading dynamically as the user scrolls.  
2. **Image Upload** — Drag & drop upload with preview, description field, and file validation.  
3. **Login & Registration** — Clean, Material-UI based authentication screens.  
4. **Profile Page** — Personal gallery grid, post stats, and inline username editing.  
5. **Dark Mode** — Persistent theme toggle with glassmorphism UI.

---

## 🛠 Tech Stack

| Layer     | Technology |
|-----------|------------|
| **Frontend** | React 19, TypeScript, Material-UI, React Router, Axios |
| **Backend**  | NestJS 9, TypeScript, Prisma ORM, Multer |
| **Database** | PostgreSQL 14 |
| **Storage**  | Local filesystem (`uploads/`) |

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourname/lumia.git
cd lumia
```

### 2️⃣ Configure Environment Variables
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

**Backend `.env`**
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3001
UPLOAD_DIR="./uploads"
CORS_ORIGIN="http://localhost:5173"
```

**Frontend `.env`**
```env
VITE_API_URL="http://localhost:3001"
```

### 3️⃣ Install Dependencies
```bash
npm install --prefix backend
npm install --prefix frontend
```

### 4️⃣ Setup Database
```bash
npm run prisma:migrate:dev --prefix backend
```

### 5️⃣ Start Development
```bash
# Backend
npm run start:dev --prefix backend

# Frontend
npm start --prefix frontend
```

---

## 📜 API Endpoints

| Method | Endpoint                 | Description          |
|--------|--------------------------|----------------------|
| POST   | `/images/upload`          | Upload a new image   |
| GET    | `/images`                 | List all images      |
| POST   | `/images/:id/like`        | Like/unlike an image |
| POST   | `/images/:id/comment`     | Add a comment        |

---

## 🗄 Database Schema (Prisma)

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

## 🤝 Contributing

1. **Fork** the repository  
2. Create your **feature branch**  
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit** changes  
   ```bash
   git commit -m "Add feature"
   ```
4. **Push** to your branch  
   ```bash
   git push origin feature/your-feature
   ```
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
