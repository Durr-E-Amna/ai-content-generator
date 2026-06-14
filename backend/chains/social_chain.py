from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.8,
)

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a social media expert who writes viral, platform-native content.
You understand what works on Instagram, LinkedIn, and Twitter/X.
Always respond in clean markdown."""),
    ("human", """Write social media content with these requirements:

Topic: {topic}
Domain: {domain}
Tone: {tone}
Style: {style}
Target audience: {audience}
Extra instructions: {extra}

Deliver 3 variations, one per platform:

## Instagram
(Visual-first, storytelling, 150-200 chars, 5-10 hashtags, emoji friendly)

## LinkedIn
(Professional, insight-led, 200-300 chars, 3-5 hashtags, no fluff)

## Twitter / X
(Punchy, under 280 chars, 2-3 hashtags, strong hook)

Write all 3 now.""")
])

output_parser = StrOutputParser()
social_chain = prompt | llm | output_parser
