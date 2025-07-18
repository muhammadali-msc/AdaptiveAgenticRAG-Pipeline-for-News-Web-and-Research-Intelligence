from fastapi import APIRouter, Depends, status, HTTPException, status, Response, Body, UploadFile, File, Request

from ..models import Models

from ..utils import Utils
from ..schemas import Schema
from ..db.database import engine, get_db
from sqlalchemy.orm import Session
import httpx
from datetime import datetime
import os
from dotenv import load_dotenv
from ..auth.Auth import JWTTokenAuth
from .graph import run_agentic_workflow
from ..utils.Utils import preprocess_document
from langchain.schema import Document

Models.Base.metadata.create_all(bind=engine)
# Load environment variables from .env file
load_dotenv()

agenticainews_router = APIRouter(
    prefix="/agenticragai",
    tags=["agenticragai"]
)

@agenticainews_router.post("/agenticworkflow", status_code=status.HTTP_200_OK)
def agentic_workflow_endpoint(payload: Schema.AgenticWorkflowRequest, get_current_user : Schema.loginUser = Depends(JWTTokenAuth.get_current_user)):
    try:
        result = run_agentic_workflow(payload.question)
        return {"question": payload.question, "answer": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    