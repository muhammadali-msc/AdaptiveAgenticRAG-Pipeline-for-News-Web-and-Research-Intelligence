from .tools import fetch_news, fetch_research, tavily_web_search
from .llm import llm
from .state import AgentState, RouteDecision, DocRelevance, AnswerQuality
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.schema import Document
from typing import List
from IPython.display import display, Markdown


def route_query(query: str) -> RouteDecision:
    """Determine where to route the query: news, research, or web_search."""
    system_prompt = """
    You are an intelligent query router for an AI assistant. Your job is to decide which of the following three categories best matches the user's query. You must return **only one word**, and you must always return one of the three valid routes — no exceptions.

    Possible routes:
    - news → For queries about current events, headlines, sports, world affairs, business, politics, or local/national/international news.
    - research → For queries involving academic studies, scholarly papers, scientific findings, research articles, or technical innovations.
    - web_search → For general queries such as how-tos, weather, directions, places, general knowledge, product searches, or anything not clearly related to news or research.

    Routing Instructions:
    - Always return exactly one of the following words: `news`, `research`, or `web_search`.
    - Never include punctuation, extra words, or explanations.
    - If the query is unclear, ambiguous, or doesn’t fit “news” or “research”, default to `web_search`.

    Examples:
    Q: "Latest news about AI"
    A: news
    Q: "Recent research on transformers"
    A: research
    Q: "Weather in Lahore today"
    A: web_search
    Q: "How to bake a cake"
    A: web_search
    Q: "arXiv papers on deep learning"
    A: research
    Q: "Show me today's sports headlines"
    A: news
    Q: "Best restaurants in New York"
    A: web_search
    Q: "COVID-19 vaccine updates"
    A: news
    Q: "Directions to the nearest hospital"
    A: web_search

    Now, analyze the following query and return only the most appropriate route (just one word — `news`, `research`, or `web_search`):
    Respond with only one word complusory: news, research, or web_search.
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "Question: {question}")
    ])
    router = prompt | llm.with_structured_output(RouteDecision)
    return router.invoke({"question": query})

def grade_relevance(question: str, document: Document) -> DocRelevance:
    """Grade document relevance to question"""
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a grader assessing document relevance to a question. 
         If the document contains keyword(s) or semantic meaning related to the question, grade as relevant ('yes')."""),
        ("human", """Question: {question}\nDocument:\n{doc_content}""")
    ])
    grader = prompt | llm.with_structured_output(DocRelevance)
    result = grader.invoke({"question": question, "doc_content": document.page_content})
    return DocRelevance(**result)

def grade_answer(question: str, documents: List[Document], generation: str) -> AnswerQuality:
    """Grade answer quality"""
    context = "\n\n".join([doc.page_content for doc in documents])
    prompt = ChatPromptTemplate.from_messages([
        ("system", """Assess if the generation:
        1. Is grounded in the provided documents
        2. Directly answers the question
        Answer 'yes' only if both conditions are met"""),
        ("human", """Question: {question}\nContext:\n{context}\nGeneration:\n{generation}""")
    ])
    grader = prompt | llm.with_structured_output(AnswerQuality)
    result = grader.invoke({
        "question": question,
        "context": context,
        "generation": generation
    })
    return AnswerQuality(**result)

def retrieve_news(state: AgentState) -> AgentState:
    """Retrieve news articles"""
    state["documents"] = fetch_news(state["question"])
    return state

def retrieve_research(state: AgentState) -> AgentState:
    """Retrieve research papers"""
    state["documents"] = fetch_research(state["question"])
    return state

def web_search(state: AgentState) -> AgentState:
    """Perform web search"""
    docs = tavily_web_search(state["question"])
    state["search_results"] = "\n".join([doc.page_content for doc in docs])
    state["documents"] = docs
    return state

def filter_documents(state: AgentState) -> AgentState:
    """Filter documents by relevance"""
    filtered = [doc for doc in state["documents"] if grade_relevance(state["question"], doc).binary_score == "yes"]
    state["documents"] = filtered
    return state

def generate_answer(state: AgentState) -> AgentState:
    """Generate answer from documents"""
    if not state["documents"]:
        state["generation"] = "I couldn't find any relevant information to answer this question."
        return state
    context = "\n\n---\n\n".join([
        f"Source: {doc.metadata.get('source', 'Unknown')}\n\n{doc.page_content}" 
        for doc in state["documents"]
    ])
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert research assistant. Answer the question based only on the provided context. \n         If you don't know the answer, say you don't know. Be detailed and specific when possible."""),
        ("human", """Question: {question}\nContext:\n{context}""")
    ])
    rag_chain = prompt | llm | StrOutputParser()
    state["generation"] = rag_chain.invoke({
        "question": state["question"],
        "context": context
    })
    return state

def evaluate_answer(state: AgentState) -> AgentState:
    """Evaluate answer quality"""
    if not state.get("generation"):
        return state
    grade = grade_answer(
        state["question"],
        state["documents"],
        state["generation"]
    )
    state["iterations"] += 1
    current_route = (
        state["route"].datasource
        if isinstance(state["route"], RouteDecision)
        else state["route"].get("datasource")
    )
    if grade.binary_score == "no" and state["iterations"] < 3:
        if current_route == "news":
            state["route"] = RouteDecision(datasource="research")
        elif current_route == "research":
            state["route"] = RouteDecision(datasource="web_search")
    return state

def init_state(state: AgentState) -> AgentState:
    """Initial node: sets the route for the workflow based on the question."""
    route = route_query(state["question"])
    if route is None:
        raise ValueError("Routing failed: LLM did not return a valid route.")
    state["route"] = route
    return state
