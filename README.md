
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

# AWS-CICD-Deployment-with-GitHub-Actions

This guide outlines the complete CI/CD setup for deploying a Dockerized application to AWS using GitHub Actions, Amazon ECR, and EC2.

---

## 🚀 Overview

The deployment process includes:

1. Building a Docker image from the source code.
2. Pushing the image to Amazon ECR (Elastic Container Registry).
3. Launching an EC2 instance.
4. Pulling the Docker image from ECR on the EC2 instance.
5. Running the container on the EC2 machine.

---

## 🛠 Prerequisites

### 1. Login to AWS Console
Start by logging into the [AWS Console](https://aws.amazon.com/console/).

### 2. Create IAM User for Deployment

#### Required AWS Access:
- **EC2 Access**: To manage virtual machines.
- **ECR Access**: To store and retrieve Docker images.

---

## 📄 IAM Policies to Attach

Attach the following managed policies to your IAM user:

1. `AmazonEC2ContainerRegistryFullAccess`
2. `AmazonEC2FullAccess`

---

## 🐳 Create ECR Repository

1. Create an ECR repository in your desired AWS region.
2. Save the repository URI (you'll need this in your GitHub secrets):e.g: 12433434343.dkr.ecr.us-east-1.amazonaws.com/adaptiveagenticrag


---

## 🖥️ Launch EC2 Instance (Ubuntu)

1. Go to the EC2 Dashboard and launch a new instance with the Ubuntu OS.
2. SSH into your EC2 instance and install Docker:

## Optional System Update:
```bash
sudo apt-get update -y
sudo apt-get upgrade
```
## Required Docker Installation: 
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
newgrp docker
```
### Configure EC2 as a Self-Hosted GitHub Runner
1. In your GitHub repository:
Settings > Actions > Runners > New self-hosted runner
2. Select your OS (Linux), and follow the instructions to register the runner.
3. Run the generated commands on your EC2 instance.

### Setup GitHub Secrets
Add the following secrets in your GitHub repository:
```bash
AWS_ACCESS_KEY_ID: Your IAM user's access key ID
AWS_SECRET_ACCESS_KEY: Your IAM user's secret access key
AWS_REGION: us-east-1
AWS_ECR_LOGIN_URI:  12345678.dkr.ecr.ap-south-1.amazonaws.com
ECR_REPOSITORY_NAME: adaptiveagenticrag
```
---