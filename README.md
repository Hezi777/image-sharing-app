<h1 align="center">
  <img src="./frontend/public/logo.png" alt="Lumia logo" width="100" /><br/>
  Lumia — Image Sharing App
</h1>

<p align="center">
  A clean, full-stack photo sharing platform inspired by Instagram.<br/>
  Upload photos, browse a responsive gallery, like & comment in real time.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/NestJS-9-E0234E?logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql" />
  <img src="https://img.shields.io/badge/Material--UI-007FFF?logo=mui&logoColor=white" />
</p>

---

## 🚀 Quick Start

```bash
# 1. Clone repo
git clone https://github.com/yourname/lumia.git
cd lumia

# 2. Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Install dependencies
npm install --prefix backend
npm install --prefix frontend

# 4. Setup database
npm run prisma:migrate:dev --prefix backend

# 5. Start development
npm run start:dev --prefix backend
npm start --prefix frontend

🖼 Screenshots
Gallery View	Upload Form

🛠 Tech Stack
Layer	Technology
Frontend	React 19, TypeScript, Material-UI, React Router, Axios
Backend	NestJS 9, TypeScript, Prisma ORM, Multer
Database	PostgreSQL 14
Storage	Local filesystem (uploads/)

📦 Features
📤 Image Upload — drag-and-drop with preview & validation

🖼 Responsive Gallery — infinite scroll & image metadata

❤️ Likes & Comments — optimistic UI updates

📱 Responsive Design — works on desktop & mobile

🔌 REST API — structured and documented

⚙ Environment Variables
Backend .env
env
Copy
Edit
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3001
UPLOAD_DIR="./uploads"
CORS_ORIGIN="http://localhost:5173"
Frontend .env
env
Copy
Edit
VITE_API_URL="http://localhost:3001"
📜 API Endpoints
Method	Endpoint	Description
POST	/images/upload	Upload a new image
GET	/images	List images
POST	/images/:id/like	Like/unlike image
POST	/images/:id/comment	Add a comment

🗄 Database Schema
prisma
Copy
Edit
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
🤝 Contributing
Fork the repo

Create your feature branch: git checkout -b feature/your-feature

Commit changes: git commit -m 'Add feature'

Push branch: git push origin feature/your-feature

Open a PR

📄 License
MIT — see LICENSE for details.

