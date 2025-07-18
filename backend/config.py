import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    COHERE_API_KEY = os.getenv("COHERE_API_KEY")
    TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
    NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    PINECONE_INDEX = os.getenv("PINECONE_INDEX")
    PINECONE_REGION = os.getenv("PINECONE_REGION", "us-east-1")
    LANGSMITH_API_KEY = os.getenv("LANGSMITH_API_KEY")

config = Config()