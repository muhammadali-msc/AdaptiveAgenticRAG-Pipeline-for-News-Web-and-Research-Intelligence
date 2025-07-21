import os
from backend.config import config
from langchain_cohere import ChatCohere, CohereEmbeddings
from langchain_groq import ChatGroq
groq_api_key=os.environ['GROQ_API_KEY']

embedder = CohereEmbeddings(
    cohere_api_key=config.COHERE_API_KEY,
    model="embed-english-v3.0"
)

llm = ChatCohere(
    cohere_api_key=config.COHERE_API_KEY,
    model="command-a-03-2025",
    temperature=0.3
)
'''
llm=ChatGroq(groq_api_key=groq_api_key,
         model_name="llama3-70b-8192")
'''