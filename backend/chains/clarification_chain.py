from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.1,
)

_conversation_history: list[str] = []

analysis_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a content requirements checker. Be VERY lenient.

Your ONLY job: check if the minimum info exists to write content.

IMPORTANT RULES:
- If topic/domain is provided → that is ENOUGH. Do NOT ask about topic again.
- If tone is provided → do NOT ask about tone.
- If format is provided → do NOT ask about format.
- If audience is provided → do NOT ask about audience.
- Word count is OPTIONAL. Never ask for it.
- If history shows any previous answer → respond READY immediately.
- When in doubt → respond READY.
- You may ask at most ONE question total.

Respond with exactly: READY
Or ONE question (under 15 words) only if content_type is completely unknown."""),
    ("human", """Content type: {content_type}
Topic / title: {topic}
Domain: {domain}
Format: {format}
Tone: {tone}
Style: {style}
Target audience: {audience}
Extra notes: {extra}

Previous clarifications already done:
{history}

Reply READY or one question only.""")
])

output_parser = StrOutputParser()
clarification_chain = analysis_prompt | llm | output_parser


def run_clarification(context: dict) -> str:
    history = "\n".join(_conversation_history) if _conversation_history else "None"
    result = clarification_chain.invoke({**context, "history": history})
    return result.strip()


def run_clarify_followup(answer: str, context: dict) -> str:
    _conversation_history.append(f"Already answered: {answer}")
    # After ANY answer from user → always proceed, no more questions
    return "READY"


def clear_memory():
    _conversation_history.clear()
