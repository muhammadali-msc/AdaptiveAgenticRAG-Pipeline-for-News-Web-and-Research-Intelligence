from typing import List, Literal, Optional, TypedDict
from pydantic import BaseModel, Field
from langchain.schema import Document

class RouteDecision(BaseModel):
    """Decision on where to route the query"""
    datasource: Literal["news", "research", "web_search"] = Field(
        description="Choose 'news', 'research', or 'web_search' based on the query deep analyses"
    )

class DocRelevance(BaseModel):
    """Document relevance grading"""
    binary_score: str = Field(
        description="'yes' if document is relevant to question, otherwise 'no'"
    )

class AnswerQuality(BaseModel):
    """Answer quality assessment"""
    binary_score: str = Field(
        description="'yes' if answer is good quality, otherwise 'no'"
    )

class AgentState(TypedDict):
    """State for our agentic workflow"""
    question: str
    route: Optional[RouteDecision]
    documents: List[Document]
    generation: Optional[str]
    search_results: Optional[str]
    iterations: int
