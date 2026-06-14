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
    ("system", """You are an e-commerce copywriting expert.
You write product descriptions that convert browsers into buyers.
Always respond in clean markdown."""),
    ("human", """Write product copy with these requirements:

Product: {topic}
Domain / category: {domain}
Tone: {tone}
Style: {style}
Target audience: {audience}
Extra instructions: {extra}

Deliver:

## Short description
(40-60 words — for product cards and previews)

## Long description
(120-180 words — for the full product page, benefit-led)

## Key features
(5 bullet points — specific, scannable, benefit-focused)

## SEO meta description
(Under 160 chars — for search engines)

Write all sections now.""")
])

output_parser = StrOutputParser()
product_chain = prompt | llm | output_parser
