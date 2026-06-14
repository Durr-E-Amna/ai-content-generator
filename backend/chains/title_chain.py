from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.9,
)

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert headline writer.
Generate punchy, specific, scroll-stopping titles.
Return ONLY a numbered list. No explanations, no extra text."""),
    ("human", """Generate exactly 5 title options for a {content_type}.

Domain / topic area: {domain}
Tone: {tone}
Style: {style}
Target audience: {audience}
Extra context: {extra}

Format — exactly like this:
1. First title here
2. Second title here
3. Third title here
4. Fourth title here
5. Fifth title here""")
])

output_parser = StrOutputParser()
title_chain = prompt | llm | output_parser
