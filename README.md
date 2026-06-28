# PrepAI — Enterprise AI Tech Interview Preparation Platform

![PrepAI Banner](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80)

**PrepAI** is a comprehensive, production-grade AI career mentorship and technical interview preparation platform. Powered by Google's Gemini 2.5 Flash AI and Cloud Firestore, PrepAI simulates enterprise technical screens, audits resumes against Applicant Tracking Systems (ATS), reviews Big-O algorithmic complexity, and delivers 24/7 executive career coaching.

---

## 🚀 Key Features

### 1. 🤖 Live AI Mock Interview Simulator
- **Principal Engineer Persona**: Simulates behavioral (STAR) and system design screens tailored to specific seniority levels (Intern to Staff/Principal).
- **Dynamic Follow-ups**: Generates context-aware follow-up prompts challenging edge cases, concurrency models, and scalability trade-offs.
- **Instant Verdict Scorecard**: Evaluates responses with a 10-point rubric, actionable strengths/improvements breakdown, and exemplary model answers.

### 2. 📄 Enterprise ATS Resume Scanner
- **Keyword Gap Matrix**: Benchmarks plain-text or uploaded resumes against target job specs (Workday, Greenhouse, Lever heuristics).
- **Callback Probability Score**: Predicts interview selection rates and identifies high-impact missing keywords.
- **Tailored Question Prediction**: Automatically forecasts custom interview questions based on your resume's past projects.

### 3. 💻 Algorithmic Practice IDE
- **Multi-Language Support**: Interactive syntax-highlighted coding environment supporting **JavaScript**, **TypeScript**, and **Python**.
- **Real-Time Big-O Analysis**: Evaluates time and space complexity instantly using Gemini code analysis engines.
- **Principal Code Refactoring**: Suggests boundary guard improvements, clean code patterns, and O(1) space optimizations.

### 4. 💬 Executive Career Mentorship Chat
- **STAR Story Structuring**: Helps craft compelling behavioral leadership examples.
- **Offer Negotiation Strategy**: Provides executive scripts and counter-offer frameworks.

### 5. ☁️ Durable Enterprise Cloud Persistence
- **Firebase Authentication**: Seamless candidate account synchronization across devices.
- **Cloud Firestore**: Encrypted, isolated persistence of interview transcripts, ATS records, and practice sessions.
- **Demo Candidate Workspace**: Includes sample chart telemetry and pre-injected sessions for instant exploration.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts
- **Backend Service**: Express.js (Node.js/ESM compiled to standalone CJS bundle)
- **AI Engine**: Google GenAI SDK (`@google/genai` v2.4) utilizing `gemini-2.5-flash` with JSON structured generation schemas
- **Database**: Google Firebase Cloud Firestore & Authentication
- **Infrastructure**: Google Cloud Run (Containerized ingress routing on Port 3000)

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root based on `.env.example`:

```env
# Required for Gemini AI API calls (Server-Side Only)
GEMINI_API_KEY="AIzaSy..."

# Host service URL injected automatically by Cloud Run / AI Studio
APP_URL="http://localhost:3000"
```

> [!IMPORTANT]
> **API Key Security**: All Gemini API calls are proxied exclusively through backend Express routes (`/api/ai/*`). Sensitive API keys are never exposed to client browser bundles.

---

## 📦 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Full-Stack Dev Server**:
   ```bash
   npm run dev
   ```
   Access the live application at `http://localhost:3000`. Backend API routes and Vite HMR middleware run concurrently on the single container port.

---

## 🌐 Production Deployment

PrepAI is pre-configured for automated bundling and deployment to **Google Cloud Run**:

1. **Production Build**:
   ```bash
   npm run build
   ```
   - Compiles the frontend React SPA into optimized static files inside `dist/`.
   - Bundles the backend Express server into a standalone `dist/server.cjs` file via `esbuild`.

2. **Start Production Container**:
   ```bash
   npm start
   ```
   Launches the standalone Express production server serving both `/api/*` endpoints and SPA fallback assets on `0.0.0.0:3000`.

---

## 🔒 Security & Privacy

- **Firebase Security Rules**: Enforce strict authenticated user isolation (`resource.data.userId == request.auth.uid`).
- **Sanitization**: All user submissions are validated server-side prior to AI prompt injection.
