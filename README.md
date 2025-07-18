
# 🧠 Adaptive RAG Agent with LangGraph + LangChain

This project implements an **adaptive Retrieval-Augmented Generation (RAG)** pipeline that uses **LangGraph** and **LangChain** to intelligently route queries, retrieve domain-specific content, evaluate document and answer quality, and retry across data sources as needed.

---

## 🚀 What It Does

Your query goes through multiple intelligent stages:

- 🧭 **Route the question**: Automatically classifies the input into `news`, `research`, or `web_search`.
- 📰 **News Retrieval**: Fetches real-time news articles using **NewsAPI**.
- 📚 **Research Access**: Retrieves scholarly papers from **arXiv**.
- 🌐 **Web Search**: Gets general web results using **Tavily API**.
- 🔍 **Document Filtering**: Grades documents for relevance using **Cohere Command-R**.
- 🗣️ **Answer Generation**: Uses the documents to generate a response with **Cohere's LLM**.
- ✅ **Answer Evaluation**: Grades the response for quality and reroutes if it's poor.
- 🔁 **Retries Intelligently**: If needed, the system retries using the next best data source.
---

## ⚙️ Tech Stack

### Backend
- **FastAPI** – Python API framework
- **LangChain** – LLM-powered document orchestration
- **LangGraph** – State-based agentic workflow
- **Cohere** – Command-R for generation, Embed v3.0 for similarity
- **NewsAPI** – Real-time news source
- **arXiv API** – Academic papers
- **Tavily** – Web search results
- **Pinecone** – Optional vector storage

### Frontend
- **React** – Using Javascript
- **Axios** – library for Calling the API Endpoint

---

## 📦 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
NEWSAPI_KEY="your_newsapi_key"
TAVILY_API_KEY="your_tavily_api_key"
COHERE_API_KEY="your_cohere_api_key"
LANGSMITH_API_KEY="your_langsmith_api_key"

# Optional Pinecone Vector DB
PINECONE_API_KEY="your_pinecone_api_key"
PINECONE_INDEX="your_index_name"
PINECONE_REGION="your_pinecone_region"
```

---
## ✅ Backend Setup

```bash
python -m venv .venv
source .venv/bin/activate 

pip install -r requirements.txt

cd backend
uvicorn main:app --reload
```

Visit: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🌐 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)


