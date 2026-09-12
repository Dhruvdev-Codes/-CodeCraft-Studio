# 🚀 CodeCraft Studio

> An interactive, modern, full-stack coding education & competitive platform built with **Next.js 14**, **Tailwind CSS**, **MongoDB**, **Monaco Editor**, **Piston Sandbox API**, and **Google Gemini AI Tutor**.

---

## ✨ Features

- **Interactive Courses & Lessons**: Structured tracks for Python, JavaScript, TypeScript, Algorithms, and Web Development with hands-on sandboxes.
- **In-Browser Cloud IDE & Code Judge**: Multi-language execution (Python, JavaScript, TypeScript, C++, Rust, Go) powered by the sandboxed Piston engine.
- **AI Coding Tutor**: Real-time contextual assistance, code explanations, error debugging, and hint generation powered by Google Gemini 1.5 Flash.
- **Timed Competitive Contests**: Live coding contests with countdown timers, automated test validation, and real-time score calculation.
- **Global Leaderboards**: Real-time user rankings by problems solved, contest performance, and course completion badges.
- **Comprehensive Admin Dashboard**: Database seeding, problem manager, and platform metrics with single-click sample data initialization.
- **Modern Authentication**: Credentials authentication with role selection (Student / Developer) + Google & GitHub OAuth compatibility.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components & Route Handlers)
- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Monaco Editor (`@monaco-editor/react`)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v4 (JWT session strategy, bcryptjs password hashing)
- **AI Integration**: `@google/genai` (Gemini 1.5 Flash)
- **Code Execution**: Piston Sandbox Engine (Docker container or public API)
- **Testing**: Node.js Native Test Runner (`node:test`) + `tsx`
- **Linting & Code Quality**: ESLint + TypeScript strict mode

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Dhruvdev-codes/-CodeCraft-Studio.git
cd -CodeCraft-Studio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# MongoDB Connection URI (e.g., MongoDB Atlas M0 free tier)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/codecraft?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Code Execution API (Default: public Piston sandbox API)
PISTON_API_URL=https://emkc.org/api/v2/piston

# AI Tutor API (Free tier from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Seed the database
Visit [http://localhost:3000/admin](http://localhost:3000/admin) and click **"Seed Initial Data"** to populate problems, courses, lessons, and contests.

---

## 🧪 Testing & Validation

Run the automated test suite:
```bash
npm test
```

Run production build check:
```bash
npm run build
```

---

## 🌐 Free-Tier Deployment Guide (Vercel + MongoDB Atlas)

1. **MongoDB Atlas**: Create a free M0 cluster and whitelist all IPs (`0.0.0.0/0`).
2. **Google AI Studio**: Obtain a free Gemini API key from [aistudio.google.com](https://aistudio.google.com).
3. **Vercel**:
   - Import your GitHub repository (`-CodeCraft-Studio`).
   - Add environment variables (`MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GEMINI_API_KEY`, `PISTON_API_URL`).
   - Deploy!
4. **Seed Production Data**: Navigate to `/admin` on your production URL and seed initial courses and problems.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
