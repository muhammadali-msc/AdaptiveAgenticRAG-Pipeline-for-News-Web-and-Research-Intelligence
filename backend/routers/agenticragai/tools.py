import logging
import requests
import xml.etree.ElementTree as ET
from typing import List
from langchain.schema import Document
from dotenv import load_dotenv
import os
from langchain_community.tools.tavily_search import TavilySearchResults
from backend.config import config

load_dotenv()

logging.basicConfig(level=logging.INFO)

def fetch_news(query: str, days: int = 7) -> List[Document]:
    """Fetch news articles from NewsAPI"""
    url = f"https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt&apiKey={config.NEWSAPI_KEY}&pageSize=2"
    if days:
        from datetime import datetime, timedelta
        from_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        url += f"&from={from_date}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        documents = [
            Document(
                page_content=f"{article['title']}\n\n{article['description']}",
                metadata={
                    "source": article['source']['name'],
                    "publishedAt": article['publishedAt'],
                    "url": article['url'],
                    "type": "news"
                }
            )
            for article in data.get('articles', [])
        ]
        return documents
    except requests.RequestException as e:
        logging.error(f"Error fetching news: {e}")
        return []

def fetch_research(query: str, max_results: int = 2) -> List[Document]:
    """Fetch research papers from ArXiv"""
    url = f"http://export.arxiv.org/api/query?search_query=all:{query}&start=0&max_results={max_results}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        root = ET.fromstring(response.text)
        documents = []
        for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
            title = entry.find('{http://www.w3.org/2005/Atom}title').text.strip()
            summary = entry.find('{http://www.w3.org/2005/Atom}summary').text.strip()
            pdf_url = next((link.get('href') for link in entry.findall('{http://www.w3.org/2005/Atom}link') if link.get('title') == 'pdf'), None)
            authors = [author.find('{http://www.w3.org/2005/Atom}name').text for author in entry.findall('{http://www.w3.org/2005/Atom}author')]
            documents.append(
                Document(
                    page_content=f"Title: {title}\n\nAbstract: {summary}",
                    metadata={
                        "source": "arXiv",
                        "published": entry.find('{http://www.w3.org/2005/Atom}published').text,
                        "url": pdf_url,
                        "authors": authors,
                        "type": "research"
                    }
                )
            )
        return documents
    except requests.RequestException as e:
        logging.error(f"Error fetching research papers: {e}")
        return []

def tavily_web_search(query: str) -> List[Document]:
    """Perform a web search using TavilySearchResults and return a list of Document objects."""
    search_tool = TavilySearchResults()
    results = search_tool.invoke({"query": query})
    # Handle both dict and string results
    if results and isinstance(results[0], dict) and "content" in results[0]:
        content = "\n".join([r["content"] for r in results])
    else:
        content = "\n".join([str(r) for r in results])
    return [Document(page_content=content)]
