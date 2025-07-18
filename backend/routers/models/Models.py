from ..db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Post(Base):
    __tablename__ = "Post"

    id = Column(Integer, primary_key=True)
    text = Column(String)
    category = Column(String)
    user_id = Column(Integer)
    author_name = Column(String)
    created_at = Column(DateTime, default=func.now())


class Category(Base):
    __tablename__ = "Category"

    id = Column(Integer, primary_key=True)
    category_name = Column(String)
    user_id = Column(Integer, ForeignKey("RegisterUser.id"))

    category_create_by = relationship("RegisterUser", back_populates="user")

class RegisterUser(Base):
    __tablename__ = "RegisterUser"

    id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String)
    password = Column(String)

    user = relationship("Category", back_populates="category_create_by")
    subscriptions = relationship("Subscription", back_populates="user")
    
class Subscription(Base):
    __tablename__ = "Subscription"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("RegisterUser.id"))
    subscription_type = Column(String)
    credits_count = Column(String)

    user = relationship("RegisterUser", back_populates="subscriptions")