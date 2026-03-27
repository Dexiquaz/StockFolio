# StockFolio

**Track, analyse and grow your investments.**

Stock Portfolio Management System — AL2 Team8 | SEPM

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + Recharts + Zustand
- **Backend:** Node.js + Express + Prisma + PostgreSQL
- **Auth:** JWT + bcrypt

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment

Create `backend/.env`:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/stockfolio"
JWT_SECRET="your-secret-key"
PORT=5000
```

### 3. Run Migrations

```bash
cd backend
npx prisma migrate dev
```

### 4. Start Dev Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:5000

## Features (Sprint 1)

- User Registration & Login (JWT)
- Portfolio Dashboard with summary cards
- Add Investment form
- Profit/Loss calculator
- Portfolio performance chart
- User profile management
