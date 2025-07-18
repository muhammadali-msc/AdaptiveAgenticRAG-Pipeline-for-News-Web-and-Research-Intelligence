from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..models import Models
from ..schemas import Schema
from ..db.database import get_db
from ..auth.Auth import JWTTokenAuth

user_router = APIRouter(
    prefix="/user",
    tags=["User"]
)

# Custom dependency to decrease credit count
def decrease_credit(db: Session = Depends(get_db), get_current_user: Schema.loginUser = Depends(JWTTokenAuth.get_current_user)):
    user = db.query(Models.RegisterUser).filter(Models.RegisterUser.email == get_current_user.email).first()
    subscription = db.query(Models.Subscription).filter(Models.Subscription.user_id == user.id).first()
    if subscription and (subscription.subscription_type == 'Freemium' or subscription.subscription_type == 'Standard'):
        if int(subscription.credits_count) <= 0:
            raise HTTPException(status_code=403, detail="Insufficient credits")
        credits_count = int(subscription.credits_count)
        credits_count -= 1
        subscription.credits_count = str(credits_count)
        db.add(subscription)
        db.commit()
    return user

@user_router.get("/{selectedCategory}/post", status_code=status.HTTP_200_OK)
def user_selectedCategory(selectedCategory: str, db: Session = Depends(get_db)):
    return db.query(Models.Post).filter(Models.Post.category == selectedCategory).all()

@user_router.get("/getCategory", status_code=status.HTTP_200_OK)
def user_getCategory(db: Session = Depends(get_db)):
    return db.query(Models.Category).all()

@user_router.post("/addCategory", status_code=status.HTTP_201_CREATED)
def user_addCategory(category: Schema.Category, db: Session = Depends(get_db), user: Models.RegisterUser = Depends(decrease_credit)):
    post_category = Models.Category(category_name=category.category_name, user_id=user.id)
    db.add(post_category)
    db.commit()
    db.refresh(post_category)
    return post_category

@user_router.post("/create", status_code=status.HTTP_201_CREATED)
def user_create(post: Schema.Post, db: Session = Depends(get_db), user: Models.RegisterUser = Depends(decrease_credit)):
    db_user = Models.Post(text=post.text, category=post.category, user_id=user.id, author_name=user.username, created_at=datetime.now())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user 