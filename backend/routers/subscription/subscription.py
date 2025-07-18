from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from ..models import Models
from ..schemas import Schema
from ..db.database import get_db

subscription_router = APIRouter(
    prefix="/subscription",
    tags=["Subscription"]
)

@subscription_router.get("/getSubscription", status_code=status.HTTP_200_OK)
def get_subscription_by_user(user_id: int, db: Session = Depends(get_db)):
    subscriptions = db.query(Models.Subscription).filter(Models.Subscription.user_id == user_id).first()
    if not subscriptions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriptions not found")
    return subscriptions

@subscription_router.put("/updateSubscription", status_code=status.HTTP_200_OK)
def update_subscription(update_subscription: Schema.Subscription, db: Session = Depends(get_db)):
    subscription = db.query(Models.Subscription).filter(Models.Subscription.user_id == update_subscription.user_id).first()
    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriptions not found")
    if update_subscription.subscription_type == "Freemium":
        credit_count = '5'
    elif update_subscription.subscription_type == "Standard":
        credit_count = '10000'
    else:
        credit_count = 'Unlimited'
    subscription.subscription_type = update_subscription.subscription_type
    subscription.credits_count = credit_count
    db.commit()
    db.refresh(subscription)
    return subscription 