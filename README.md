---

## Running Locally

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Add your Groq API key to .env
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Get a free Groq API key at console.groq.com — no credit card required.

---

## Live Demo

Frontend: [contentai on Vercel](https://ai-content-generator.vercel.app)
Backend: [contentai API on Render](https://contentai-backend-m595.onrender.com/health)

> First load may take 30 seconds — free tier backend spins down when inactive.

---

Free to use · Easy to generate · Open to feedback
