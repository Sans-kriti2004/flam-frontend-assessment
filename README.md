# StudyForge AI - Interactive AI Study Assistant

An interactive, premium, and highly pedagogical AI-powered Study Assistant. Users can paste text notes or general topics, and the application generates custom structured **learning roadmaps**, **interactive flashcards**, and **multiple-choice quizzes** with detailed explanations.

Built as part of the **Software Engineering / Frontend Intern Assignment** for **Flam**.

### 🔗 Project Links
* 🎥 **[Working Model Demo Video](https://drive.google.com/file/d/18HPQIKkmq9xaJdFg0KNrjZgKpgTOj3gP/view?usp=sharing)**
* 🌐 **[Live Deployed URL](https://flam-frontend-assessment-xt9c.onrender.com/)**

---

## 🚀 Quick Start & Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **NPM** (v9.0.0 or higher)
- **Google Gemini API Key** (Get a free key from [Google AI Studio](https://aistudio.google.com/))

### 1. Installation
To install dependencies for both the frontend and backend in one command, run:
```bash
npm run install-all
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (or copy the provided `.env.example`) and fill in your Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
```

### 3. Running the App (Local Dev)
To start both the Express backend and the Vite frontend dev server concurrently:
```bash
npm start
```
- The frontend will open at `http://localhost:5173`.
- The backend will run at `http://localhost:3001` (calls are proxied automatically).

---

## 🎨 Architectural Design & Logic Breakdown

This project was built to show a high standard of software engineering maturity. Here is a breakdown of the core systems so that the code is easy to explain during the interview:

### 1. Guaranteed Structured AI Output (Gemini JSON Schema)
Instead of relying on regex or loose prompt engineering which often yields malformed JSON from LLMs, the backend (`backend/server.js`) utilizes the Gemini API's native **Structured Outputs** feature:
- Enforces `responseMimeType: "application/json"`.
- Declares a strict **JSON Schema** matching standard OpenAPI format. This guarantees that Gemini will *always* respond with the exact JSON fields (`topic`, `summary`, `roadmap`, `flashcards`, `quiz`), eliminating parsing failures.

### 2. Secure Backend Proxy Architecture
To satisfy the security requirement of **not shipping API keys in the browser**, the client calls a local Node.js Express server (`backend/server.js`). The Express server acts as a thin proxy, keeping the Gemini API credentials securely on the server-side.

### 3. Protection Against Stale Responses (`AbortController`)
In fast-paced web apps, slow or overlapping API calls can trigger race conditions where an older request finishes after a newer one, overwriting it.
- To prevent this, the client API wrapper (`frontend/src/utils/api.js`) creates and tracks an `AbortController`.
- Before executing any new generation or refinement request, it calls `.abort()` on any active controller, canceling the pending HTTP request instantly on the network level.

### 4. Interactive State Management
- **Flashcard 3D Transitions**: Implemented using pure CSS 3D transforms (`backface-visibility`, `transform-style: preserve-3d`) for native-feeling fluid flips.
- **Quiz Re-Test Engine**: When finishing a quiz, the IDs of wrong answers are tracked in a `Set`. Selecting "Re-Test Wrong Answers" filters the quiz array down to only those items and resets the quiz state, allowing users to drill down on their gaps in knowledge.
- **Local Session Persistence**: All study materials are automatically stored in `localStorage` on creation. Users can open the slide-out **Sessions Drawer** to reload, review, or clear their study modules instantly.
- **Live Refinement Loop**: Users can customize their active study materials by typing modifications in the bottom refiner (e.g. *"make the quiz questions harder"*). The backend receives the current JSON state and the refinement prompt, and prompts the LLM to rewrite the study material while adhering to the original JSON schema structure.

---

## 🤖 AI Usage Note

*In alignment with the assignment guidelines, here is a breakdown of what AI was used for during development:*
- Used AI to brainstorm the glassmorphic styling system, generating smooth CSS transitions and responsive viewport variables.
- Assisted in drafting boilerplate configurations for Vite and proxy rules.
- Helped generate sample educational notes used for suggestions (e.g., Photosynthesis, REST vs GraphQL).
- Used AI for regression testing and code validation.
- All core application logic (cancellation hooks, re-test filter, structured schema layout, proxy routes) was designed and composed by hand.

---

## 🛠️ Known Limitations & Future Improvements

1. **Local Storage Limits**: `localStorage` is restricted to ~5MB. If a user stores dozens of highly detailed textbook notes, it could reach capacity.
   - *Future improvement*: Migrate to IndexedDB or a remote database.
2. **Context Window for Refinements**: Since the refinement loop sends the current study material back to Gemini to update, very large study materials may consume significant context tokens.
3. **No Auth**: Sessions are stored globally per browser.
   - *Future improvement*: Add JWT authentication to isolate user sessions.

---

## ⏱️ Time Spent Breakdown
- **Ideation, UX Drafting, & Schema Planning**: 1 hour
- **Express Backend & Gemini JSON Schema Implementation**: 1.5 hours
- **Vite React Frontend Architecture & Abort Controller Hooks**: 3.5 hours
- **Vanilla CSS Glassmorphism & Keyframe Polish**: 1.5 hours
- **Documentation & Build Verification**: 0.5 hours
- **Total Duration**: **8 Hours**
