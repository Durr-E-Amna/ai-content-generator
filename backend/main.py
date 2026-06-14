from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import os, json, re

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

app = FastAPI(title="ContentAI v3")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"), temperature=0.4)
_llm_gen = ChatGroq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"), temperature=0.75)
_llm_creative = ChatGroq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"), temperature=0.92)

# ── Models ────────────────────────────────────────────────────────────────────

class ExtractRequest(BaseModel):
    prompt: str

class Intent(BaseModel):
    content_type:  str
    topic:         str
    tone:          list[str]
    audience:      list[str]
    format:        str
    platform:      Optional[str] = ""
    language:      Optional[str] = "English"
    word_count:    Optional[str] = ""
    key_points:    list[str]

class GenerateRequest(BaseModel):
    prompt:       str
    intent:       Intent
    variation:    str = "A"

class RefineRequest(BaseModel):
    original:     str
    instruction:  str

class RepurposeRequest(BaseModel):
    content:       str
    target_format: str
    notes:         Optional[str] = ""

# ── Extract intent chain ──────────────────────────────────────────────────────

extract_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an intent extraction engine for a content generator.
Extract structured information from the user's natural language request.

RESPOND WITH ONLY VALID JSON — no markdown, no backticks, no explanation.

Return exactly this structure:
{{
  "content_type": "one of: Blog post, Article, Social post, Email, Newsletter, YouTube script, Podcast outline, LinkedIn post, Tweet thread, Press release, Case study, Landing page copy, Ad copy, Caption, Job description, FAQ, Bio, Review response, Cold outreach, Other",
  "topic": "the specific topic or title they want written about (be specific)",
  "tone": ["array of tones detected — e.g. Professional, Casual, Inspirational, Humorous, Authoritative, Empathetic, Urgent, Conversational"],
  "audience": ["array of audiences — e.g. Beginners, Professionals, Students, General public, Decision makers, Tech-savvy users"],
  "format": "e.g. How-to guide, Opinion piece, Listicle, Narrative, Explainer, Interview-style, Case study",
  "platform": "if mentioned — e.g. LinkedIn, Instagram, Medium, YouTube, Newsletter, Company blog — else empty string",
  "language": "English unless user specified otherwise",
  "word_count": "if mentioned e.g. 800 words or 500-700 words — else empty string",
  "key_points": ["up to 4 key points or angles the user wants covered, inferred from their request"]
}}

Be smart about inference. If user says write me a funny blog post about AI for beginners, extract:
content_type: Blog post, tone: Humorous, audience: Beginners, key_points: AI topic
"""),
    ("human", "{prompt}")
])

extract_chain = extract_prompt | _llm | StrOutputParser()

# ── Generation chain ──────────────────────────────────────────────────────────

gen_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert content writer. Write high-quality, engaging content.
Always respond in clean markdown.
{variation_note}"""),
    ("human", """User's original request: {prompt}

Confirmed intent:
- Content type: {content_type}
- Topic: {topic}
- Tone: {tone}
- Target audience: {audience}
- Format: {format}
- Platform: {platform}
- Language: {language}
- Word count target: {word_count}
- Key points to cover: {key_points}

Write the complete content now. Be specific, original, and genuinely valuable.""")
])

gen_chain_a = gen_prompt | _llm_gen      | StrOutputParser()
gen_chain_b = gen_prompt | _llm_creative | StrOutputParser()

# ── Refine chain ──────────────────────────────────────────────────────────────

refine_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert editor. Return the COMPLETE revised piece in clean markdown. No preamble."),
    ("human", "Original:\n\n{original}\n\n---\nInstruction: {instruction}\n\nReturn full revised version.")
])
refine_chain = refine_prompt | _llm_gen | StrOutputParser()

# ── Repurpose chain ───────────────────────────────────────────────────────────

repur_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a content repurposing expert. Convert content to fit the target format natively — correct length, tone, and structure. Respond in clean markdown."),
    ("human", "Original content:\n{content}\n\n---\nConvert to: {target_format}\nNotes: {notes}\n\nWrite the repurposed version now.")
])
repur_chain = repur_prompt | _llm_gen | StrOutputParser()

# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/extract")
async def extract(req: ExtractRequest):
    """Parse user's free-text prompt into structured intent."""
    raw = extract_chain.invoke({"prompt": req.prompt})
    # Strip any accidental markdown fences
    cleaned = re.sub(r"```(?:json)?|```", "", raw).strip()
    try:
        data = json.loads(cleaned)
        return {"intent": data}
    except json.JSONDecodeError:
        # Fallback — return minimal intent
        return {
            "intent": {
                "content_type": "Blog post",
                "topic": req.prompt[:120],
                "tone": ["Professional"],
                "audience": ["General public"],
                "format": "Explainer",
                "platform": "",
                "language": "English",
                "word_count": "",
                "key_points": [],
            }
        }


@app.post("/generate")
async def generate(req: GenerateRequest):
    """Generate content from confirmed intent."""
    intent = req.intent
    variation_note = (
        "Write a well-structured, clear version. Strong headline, logical flow, concrete value."
        if req.variation == "A" else
        "Write a more unexpected, creative version. Different hook, fresh angle, surprising structure. Do NOT write the obvious version."
    )
    chain = gen_chain_b if req.variation == "B" else gen_chain_a
    result = chain.invoke({
        "prompt":       req.prompt,
        "content_type": intent.content_type,
        "topic":        intent.topic,
        "tone":         ", ".join(intent.tone) if intent.tone else "Professional",
        "audience":     ", ".join(intent.audience) if intent.audience else "General public",
        "format":       intent.format,
        "platform":     intent.platform or "",
        "language":     intent.language or "English",
        "word_count":   intent.word_count or "",
        "key_points":   ", ".join(intent.key_points) if intent.key_points else "",
        "variation_note": variation_note,
    })
    return {"output": result}


@app.post("/refine")
async def refine(req: RefineRequest):
    result = refine_chain.invoke(req.dict())
    return {"output": result}


@app.post("/repurpose")
async def repurpose(req: RepurposeRequest):
    result = repur_chain.invoke(req.dict())
    return {"output": result}


@app.get("/health")
async def health():
    return {"status": "ok"}
