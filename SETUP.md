# AI Content Generator — Complete Setup Guide

---

## Prerequisites (install these first if you don't have them)

| Tool | Check if installed | Install link |
|------|--------------------|--------------|
| Python 3.10+ | `python --version` | https://python.org/downloads |
| Node.js 18+ | `node --version` | https://nodejs.org |
| VS Code | — | https://code.visualstudio.com |

---

## Project structure (what you have)

```
ai-content-generator/
├── backend/
│   ├── main.py                        ← FastAPI app, all endpoints
│   ├── .env                           ← your Groq API key goes here
│   ├── requirements.txt
│   └── chains/
│       ├── __init__.py
│       ├── clarification_chain.py     ← LangChain requirement analysis + memory
│       ├── blog_chain.py              ← blog / article generation
│       ├── social_chain.py            ← social media generation
│       ├── email_chain.py             ← email copy generation
│       └── product_chain.py           ← product description generation
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── generate.js            ← all axios calls to backend
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ChipGroup.jsx          ← reusable chip selector
        │   └── OutputPanel.jsx        ← markdown output display
        └── pages/
            └── Home.jsx               ← main page (form + phases)
```

---

## Step 1 — Get your free Groq API key

1. Go to https://console.groq.com
2. Sign up (free, no credit card)
3. Click **API Keys** in the left sidebar
4. Click **Create API Key** → copy it
5. Open `backend/.env` and replace `your_groq_api_key_here` with your actual key:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## Step 2 — Open the project in VS Code

```
Open VS Code → File → Open Folder → select the ai-content-generator folder
```

You should see both `backend/` and `frontend/` in the Explorer panel.

---

## Step 3 — Set up the backend

Open a terminal in VS Code: **Terminal → New Terminal**

```bash
# 1. Go into the backend folder
cd backend

# 2. Create a virtual environment (keeps your packages isolated)
python -m venv venv

# 3. Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# You should now see (venv) at the start of your terminal line

# 4. Install all dependencies
pip install -r requirements.txt

# This takes 1-2 minutes the first time
```

---

## Step 4 — Run the backend

Still in the `backend/` folder with the venv activated:

```bash
uvicorn main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

Leave this terminal running. Open a second terminal for the frontend.

### Quick test (optional but recommended)
Open your browser and go to: http://localhost:8000/health
You should see: `{"status":"ok"}`

You can also visit: http://localhost:8000/docs
This opens the auto-generated API docs where you can test each endpoint manually.

---

## Step 5 — Set up and run the frontend

Open a **second terminal** in VS Code (click the + icon in the terminal panel):

```bash
# 1. Go into the frontend folder
cd frontend

# 2. Install all npm packages
npm install

# This takes 1-2 minutes the first time

# 3. Start the dev server
npm run dev
```

You should see:
```
  VITE v5.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

Open your browser and go to: **http://localhost:5173**

---

## How the app works (for your understanding / presentation)

```
User fills form  →  POST /intake
                         ↓
               LangChain clarification_chain runs
               (ChatPromptTemplate → Groq LLM → StrOutputParser)
                         ↓
              ┌──────────────────────────┐
              │  Status = "ready"?       │
              │  YES → POST /generate   │
              │  NO  → show question    │
              └──────────────────────────┘
                         ↓ (if clarifying)
User answers  →  POST /clarify
               memory updated, re-runs chain
                         ↓
               When ready → POST /generate
               (content-specific LCEL chain runs)
                         ↓
               Markdown output rendered in UI
```

### LangChain concepts demonstrated
| Concept | File | What it does |
|---------|------|-------------|
| `ChatPromptTemplate` | every chain file | Structures system + human messages with `{variables}` |
| LCEL chain (`|`) | every chain file | Composes `prompt \| llm \| parser` in one expression |
| `StrOutputParser` | every chain file | Converts LLM response to a clean Python string |
| Conversation memory | `clarification_chain.py` | Stores Q&A history so the agent doesn't repeat questions |

---

## Common errors and fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `GROQ_API_KEY not found` | `.env` not set up | Add your key to `backend/.env` |
| `ModuleNotFoundError: langchain_groq` | venv not activated or install failed | Re-activate venv, re-run `pip install -r requirements.txt` |
| `Network Error` in browser | Backend not running | Start uvicorn in the backend terminal |
| `CORS error` in browser console | Wrong port | Make sure frontend is on 5173 and backend on 8000 |
| `(venv)` not showing | Venv not activated | Run the activate command again (Step 3) |
| Groq `rate limit` error | Too many requests | Wait 60 seconds and try again (free tier limit) |

---

## VS Code recommended extensions

Install these for a better experience:
- **Python** (by Microsoft) — Python language support
- **Pylance** — Python type checking
- **ES7+ React/Redux/React-Native snippets** — React shortcuts
- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
- **Prettier** — code formatter

Install via: **Extensions panel (Ctrl+Shift+X)** → search name → Install

---

## Running both servers every time

Every time you want to work on the project:

**Terminal 1 (backend):**
```bash
cd backend
venv\Scripts\activate     # Windows
# or: source venv/bin/activate  (Mac/Linux)
uvicorn main:app --reload
```

**Terminal 2 (frontend):**
```bash
cd frontend
npm run dev
```

Then open http://localhost:5173

---

## Day 1 checklist
- [ ] Python installed
- [ ] Node.js installed
- [ ] Groq API key added to `.env`
- [ ] `pip install -r requirements.txt` completed
- [ ] Backend running (`uvicorn main:app --reload`)
- [ ] `/health` endpoint returns ok
- [ ] Test `/intake` and `/generate` in http://localhost:8000/docs

## Day 2 checklist
- [ ] `npm install` completed in frontend/
- [ ] Frontend running (`npm run dev`)
- [ ] Full flow works: form → clarify → generate → output
- [ ] Copy and Download buttons work
- [ ] Tested all 4 content types
