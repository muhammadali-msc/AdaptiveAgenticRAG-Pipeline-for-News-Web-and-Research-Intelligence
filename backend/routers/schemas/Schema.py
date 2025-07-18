from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
import re

class RegisterUser(BaseModel):
    username: str
    email: EmailStr
    password: str
    subscription_type: str
    
    @field_validator("password")
    @classmethod
    def password_strength(cls, value):
        if len(value) < 6:
            raise ValueError("Password must be at least 6 characters long")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain at least one special character")
        return value

    class Config:
        from_attributes = True

class loginUser(BaseModel):
    username: str
    password: str

class Post(BaseModel):
    text: str
    category: str

    class Config():
        from_attributes = True
        
class Category(BaseModel):
    category_name : str

    class Config():
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id : int
    username : str
    email : str

class TokenData(BaseModel):
    email: Optional[str] = None

class CohereLLMData(BaseModel):
    text: str
    category_tone: str

class Subscription(BaseModel):

    user_id : int
    subscription_type : str

class UpdatePassword(BaseModel):
    email :  str
    current_password : str
    update_password : str

class AgenticWorkflowRequest(BaseModel):
    question: str