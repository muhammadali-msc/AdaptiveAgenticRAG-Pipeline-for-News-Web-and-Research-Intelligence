from langgraph.graph import StateGraph, END
from .state import AgentState, RouteDecision
from .nodes import (
    init_state,
    retrieve_news,
    retrieve_research,
    web_search,
    filter_documents,
    generate_answer,
    evaluate_answer
)
import logging
from IPython.display import display, Markdown, Image

def should_continue(state: AgentState) -> str:
    if state["iterations"] < 2 and state.get("generation"):
        current_route = (
            state["route"].datasource
            if isinstance(state["route"], RouteDecision)
            else state["route"].get("datasource")
        )
        if current_route is None:
            logging.warning("Current route is None, ending workflow.")
            return "end"
        return current_route
    return "end"

def get_agentic_workflow():
    workflow = StateGraph(AgentState)
    # Add nodes
    workflow.add_node("init", init_state)
    workflow.add_node("get_news", retrieve_news)
    workflow.add_node("get_research", retrieve_research)
    workflow.add_node("search_web", web_search)
    workflow.add_node("filter_docs", filter_documents)
    workflow.add_node("generate", generate_answer)
    workflow.add_node("evaluate", evaluate_answer)
    # Set entry point
    workflow.set_entry_point("init")
    # Routing logic
    workflow.add_conditional_edges(
        "init",
        lambda state: state["route"]["datasource"] if isinstance(state["route"], dict) else state["route"].datasource,
        {
            "news": "get_news",
            "research": "get_research",
            "web_search": "search_web"
        }
    )
    # Main flow
    workflow.add_edge("get_news", "filter_docs")
    workflow.add_edge("get_research", "filter_docs")
    workflow.add_edge("search_web", "filter_docs")
    workflow.add_edge("filter_docs", "generate")
    workflow.add_edge("generate", "evaluate")
    workflow.add_conditional_edges(
        "evaluate",
        should_continue,
        {
            "news": "get_news",
            "research": "get_research",
            "web_search": "search_web",
            "end": END
        }
    )
    return workflow.compile()

def run_agentic_workflow(question: str):
    logging.info(f"Running agent workflow for question: {question}")
    input_data = {
        "question": question,
        "iterations": 0,
        "route": None,
        "documents": [],
        "generation": None,
        "search_results": None
    }
    try:
        result = get_agentic_workflow().invoke(input_data)
        return result     
    except KeyError as e:
        logging.error(f"KeyError: {e}. Please check the workflow setup and input structure.")
    except Exception as e:
        logging.error(f"An error occurred: {e}")
