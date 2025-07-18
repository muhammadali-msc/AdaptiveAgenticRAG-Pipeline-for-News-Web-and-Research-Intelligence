import os
from backend.config import config
from langchain_cohere import ChatCohere, CohereEmbeddings

embedder = CohereEmbeddings(
    cohere_api_key=config.COHERE_API_KEY,
    model="embed-english-v3.0"
)

llm = ChatCohere(
    cohere_api_key=config.COHERE_API_KEY,
    model="command-a-03-2025",
    temperature=0.3
)
