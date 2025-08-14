# AI Finance Tracker

**Live Project:** [View Live on Vercel](https://finance-tracker-web-app.vercel.app/)


A modern personal finance tracker that combines real-time expense management with AI-powered insights — built using **Next.js 13**, **Tailwind CSS**, **Firebase**, and an embedded **RAG chatbot** via Chatling AI.

---

## Overview

AI Finance Tracker helps users monitor income, expenses, and savings in a sleek dashboard, while a built-in chatbot answers natural language questions using context from a curated knowledge base.

---

##  Features

-  **User Authentication**: Secured with Firebase Auth to protect financial data
-  **Real-Time Database**: Uses Firestore to store and fetch expense data instantly
-  **Transaction Management**: Add, edit, and categorize income/expenses
-  **Chart Visualizations**: Dynamic insights powered by Chart.js
-  **Global State Management**: Built with React Context API
-  **AI Chatbot (RAG)**: Chatling AI chatbot answers financial questions using a knowledge base
-  **Toast Notifications**: Real-time feedback on user actions
-  **Modern UI**: Built with Tailwind CSS and responsive components

---

##  AI Chatbot Integration (RAG with Chatling AI)

To make the app smarter, a no-code RAG-style chatbot was integrated using Chatling AI:

### RAG Architecture Breakdown

| Step | Action |
|------|--------|
| 1 | Uploaded finance docs or generated Q&A-style knowledge base |
| 2 | Captured user queries using a text input block |
| 3 | Retrieved relevant content from the KB |
| 4 | Generated contextual response using an LLM |
| 5 | Looped conversation for natural back-and-forth |

> Example queries: "How much did I spend on food last month?" or "What's my biggest spending category?"

---

## Tech Stack

### Frontend
- Next.js 13
- React
- Tailwind CSS
- Chart.js

### Backend
- Firebase Auth
- Firebase Firestore

### AI Layer
- Chatling AI (RAG Chatbot)
- OpenAI (via Chatling)
- Optional: FAISS for vector storage

### Tooling
- React Context API (state management)
- Toastify (notifications)
- Git + GitHub
- Vercel (deployment)

---

## 🛠️ Getting Started

```bash
git clone https://github.com/your-username/ai-finance-tracker.git
cd ai-finance-tracker
npm install
npm run dev
```

### Create `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdefghijk
```

Add `OPENAI_API_KEY` if needed.

---

## License

MIT License — 2025
