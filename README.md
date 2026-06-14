# ContentAI — AI-Powered Content Studio

A full-stack AI content generation platform that understands your intent before writing a single word.

Built with React, FastAPI, LangChain, and Groq's free LLM API as a personal learning project.


## The Problem

Every AI content tool puts the burden on you.
Write a prompt. Get generic output. Rewrite it. Still wrong. Add more detail. Still missing the tone.

The root cause is simple — the AI never actually understood what you wanted.

ContentAI fixes this with an **intent confirmation step**.


## How It Works

1. **Describe** — Write what you want in plain English. No forms, no dropdowns, no configuration.
2. **Confirm** — The AI extracts your intent (content type, tone, audience, format, platform, key points) and shows it back to you as an editable card. You approve or correct it.
3. **Pick** — Two versions generated in parallel. Version A is structured. Version B is creative. Read both and choose.
4. **Edit** — Refine with a smart sidebar — 10 one-click suggestions or a custom instruction.


## Features

- Intent confirmation before generation — no more vague prompts giving vague output
- Dual version generation — structured vs creative, generated simultaneously
- Smart edit sidebar — one-click suggestions + custom free-text instructions
- Content repurposer — convert any existing content to any format natively
- Session history — every draft auto-saved to localStorage, accessible anytime
- Multi-select tone and audience
- Language support — generate in any language
- Copy to clipboard and download as Markdown


## Content Types Supported

Blog post · Article · Social post · Email · Newsletter · YouTube script · Podcast outline · LinkedIn post · Tweet thread · Press release · Case study · Landing page copy · Ad copy · Caption · Job description · FAQ · Bio · Review response · Cold outreach


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Python + FastAPI |
| AI Framework | LangChain (Prompt Templates · LCEL Chains · Output Parsers) |
| LLM | Groq API · llama-3.3-70b-versatile |
| Fonts | Playfair Display + Inter |
| Storage | localStorage (no database needed) |


## LangChain Concepts Demonstrated

- ChatPromptTemplate — structured system + human message prompts
- LCEL chain pattern — prompt | llm | output_parser
- StrOutputParser — clean string output from LLM responses
- Multiple chain composition — separate chains for extraction, generation A, generation B, refine, repurpose
- Parallel generation — Promise.allSettled firing two chains simultaneously


## Running Locally

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Get a free Groq API key at console.groq.com — no credit card required.


## Live Demo

Frontend: https://ai-content-generator.vercel.app

Backend health check: https://contentai-backend-m595.onrender.com/health

First load may take 30 seconds — free tier backend spins down when inactive.


Built in under 2 days · Zero paid APIs · Open to feedback
