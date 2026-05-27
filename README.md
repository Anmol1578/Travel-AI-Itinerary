# 🪐 Orbitra | Full-Stack AI Travel Itinerary Planner

Orbitra is a production-ready, full-stack MERN application that leverages generative AI to construct dynamic, optimized, and tailored travel itineraries. Built with an event-driven architectural mindset, the platform provides robust authentication, low-latency API handshakes, and a responsive glassmorphic design optimized for modern engineering paradigms.

🛰️ **Live Production Client:** [https://travel-ai-itinerary-2.onrender.com](https://travel-ai-itinerary-2.onrender.com)  
⚡ **Live API Service:** [travel-ai-itinerary-web.onrender.com/api](https://travel-ai-itinerary-web.onrender.com)

---

## 🛠️ System Architecture & Tech Stack

### Frontend Architecture
* **Framework:** React 18 with Vite (for near-instantaneous hot module reloading and ultra-fast production builds)
* **Styling Matrix:** Tailwind CSS v4 (leveraging the new high-performance Rust-based compiler engine)
* **State & Routing:** Context API (clean authentication state propagation) + React Router v6
* **Data Layer:** Axios (configured with centralized interceptors for dynamic environment routing and automated JWT header injection)

### Backend Infrastructure
* **Runtime Environment:** Node.js (v24 LTS) + Express.js
* **Database Engine:** MongoDB Atlas via Mongoose ODM (featuring relational schema mapping and strict input sanitization)
* **AI Integration Layer:** Google Gemini Pro API via the `@google/genai` SDK
* **Security & Auth:** JSON Web Tokens (JWT) + Bcrypt.js password hashing, locked down with cross-origin resource sharing (CORS) whitelists

---

## 🚀 Key Engineering Highlights (Recruiter Focus)

* **Cross-Origin Resource Sharing (CORS) Isolation:** Configured explicit production origins to block unauthorized domain access, maintaining strict security boundaries between the static layout and the API layer.
* **Dynamic Environment Switching:** Built a resilient database and API base URL gateway that switches instantly between local development contexts (`localhost:5000`) and distributed multi-instance cloud variables in production.
* **Automated JWT Security Lifecycles:** Implemented a global Axios request interceptor that parses client-side local storage and appends authorization headers conditionally without polluting component-level logic.
* **Modern Tailwind v4 Compiler Implementation:** Early adoption of the optimized `@tailwindcss/vite` compilation matrix, reducing CSS bundle overhead and prioritizing asset loading speed.
* **Resilient Client-Side SPA Routing:** Implemented custom server-level rewrite catch-all rules (`/* -> /index.html`) on deployment layers to completely circumvent static asset 404 tracking crashes.

---

## 📋 API Endpoints Matrix

### Authentication Gateway
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Compiles new operator schemas | `{ name, email, password }` |
| `POST` | `/api/auth/login` | Validates session & issues JWT | `{ email, password }` |

### AI Itinerary Processing
| Method | Endpoint | Description | Headers |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/itinerary/generate` | Calls Gemini AI engine & saves matrix | `Authorization: Bearer <token>` |

---

## ⚙️ Local Installation & Development

To clone, audit, and boot this ecosystem locally, follow these steps:

### 📋 1. Prerequisites

Ensure your system environment has the baseline runtime engines configured globally:

┌──────────────────────────────────────────────────────────────────────────┐
│  • Node.js (v20.0.0 or higher recommended)                               │
│  • npm (Node Package Manager)                                            │
└──────────────────────────────────────────────────────────────────────────┘

---

### 📂 2. Clone the Repository

Pull the production codebase from GitHub and step directly into the working directory tree:

┌──────────────────────────────────────────────────────────────────────────┐
│  $ git clone https://github.com/Anmol1578/Travel-AI-Itinerary.git        │
│  $ cd Travel-AI-Itinerary                                                │
└──────────────────────────────────────────────────────────────────────────┘

### 🖥️ 3. Server Node Configuration

Navigate to the root project directory to initialize your backend environment configurations:

┌──────────────────────────────────────────────────────────────────────────┐
│  $ npm install                                                           │
└──────────────────────────────────────────────────────────────────────────┘

Create a `.env` file directly within the root directory:

┌──────────────────────────────────────────────────────────────────────────┐
│  PORT=5000                                                               │
│  MONGO_URI=your_mongodb_connection_string                                │
│  JWT_SECRET=your_jwt_signing_key                                         │
│  GEMINI_API_KEY=your_google_gemini_api_key                               │
│  FRONTEND_URL=http://localhost:5173                                      │
└──────────────────────────────────────────────────────────────────────────┘

Execute the initialization script to boot up the Node development environment:

┌──────────────────────────────────────────────────────────────────────────┐
│  $ npm start                                                             │
└──────────────────────────────────────────────────────────────────────────┘

---

### 🎨 4. Client UI Configuration

Step directly into the frontend directory container to assemble your UI runtime modules:

┌──────────────────────────────────────────────────────────────────────────┐
│  $ cd frontend && npm install                                            │
└──────────────────────────────────────────────────────────────────────────┘

Create a secondary, isolated client-side `.env` file within the `frontend` folder:

┌──────────────────────────────────────────────────────────────────────────┐
│  VITE_API_BASE_URL=http://localhost:5000/api                             │
└──────────────────────────────────────────────────────────────────────────┘

Launch the local Vite bundler to compile and spin up the user interface:

┌──────────────────────────────────────────────────────────────────────────┐
│  $ npm run dev                                                           │
└──────────────────────────────────────────────────────────────────────────┘
