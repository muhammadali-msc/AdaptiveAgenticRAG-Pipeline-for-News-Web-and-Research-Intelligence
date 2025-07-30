from fastapi import FastAPI
from .routers.auth.Auth import auth_router
from .routers.agenticragai.agenticragai import agenticainews_router
from .routers.subscription.subscription import subscription_router
from .routers.user.user import user_router
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[f'{os.getenv("DEV_BASE_URL")}:3000', "*",f'{os.getenv("PROD_BASE_URL")}:3000'],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth_router)
app.include_router(agenticainews_router)
app.include_router(subscription_router)
app.include_router(user_router)
