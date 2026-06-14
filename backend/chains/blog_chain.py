from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.75,
)

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert blog and article writer.
Write engaging, well-structured, SEO-friendly content.
Always respond in clean markdown."""),
    ("human", """Write a {format} {content_type} with the following requirements:

Topic / title: {topic}
Domain: {domain}
Tone: {tone}
Style: {style}
Target audience: {audience}
Extra instructions: {extra}

Structure:
- A compelling title (H1)
- An engaging introduction (2-3 sentences)
- 3 to 4 main sections with subheadings (H2)
- Each section has 2-3 solid paragraphs
- A strong conclusion with a takeaway
- If appropriate, a call-to-action at the end

Write the full piece now.""")
])

output_parser = StrOutputParser()
blog_chain = prompt | llm | output_parser
