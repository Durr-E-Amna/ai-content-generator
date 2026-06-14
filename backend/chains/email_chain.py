from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.7,
)

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert email copywriter.
You write emails that get opened, read, and acted upon.
Always respond in clean markdown."""),
    ("human", """Write a marketing/professional email with these requirements:

Topic / purpose: {topic}
Domain: {domain}
Tone: {tone}
Style: {style}
Target audience: {audience}
Extra instructions: {extra}

Structure:
## Subject line
(Write 2-3 subject line options, label them A / B / C)

## Preview text
(1 line, 80-100 chars, complements the subject)

## Email body
**Greeting**
[personalised opener]

**Opening hook** (1-2 sentences — make them want to keep reading)

**Value / body** (2-3 short paragraphs — the core message)

**Call to action** (clear, single CTA button text + 1 sentence around it)

**Sign-off**
[name placeholder]

Write the full email now.""")
])

output_parser = StrOutputParser()
email_chain = prompt | llm | output_parser
