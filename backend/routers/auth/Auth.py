from fastapi import APIRouter, status, Depends, HTTPException, Response
from ..schemas import Schema
from ..db.database import get_db
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from ..utils import Utils
from ..models import Models
from . import JWTTokenAuth

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@auth_router.post("/login", response_model=Schema.Token)
def user_login(request_login: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):

    user_detail = db.query(Models.RegisterUser).filter(Models.RegisterUser.email == request_login.username).first()

    if not user_detail:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User doesn't exist")
    if not Utils.verify_password(request_login.password, user_detail.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Password is incorrect")

    access_token = JWTTokenAuth.create_access_token(data={"sub": user_detail.email})
    return Schema.Token(access_token=access_token, token_type="bearer", user_id = user_detail.id, username = user_detail.username, email = user_detail.email)

@auth_router.post("/signup", status_code=status.HTTP_201_CREATED)
def user_registration(registerUser: Schema.RegisterUser, db: Session = Depends(get_db)):

    user = db.query(Models.RegisterUser).filter(Models.RegisterUser.email == registerUser.email).first()

    if not user:
        if registerUser.subscription_type == "Freemium":
            credit_count = '5'
        else:
            credit_count = 'Unlimited'

        db_register_user = Models.RegisterUser(username=registerUser.username, email=registerUser.email,
                                               password=Utils.get_password_hash(registerUser.password))
        db.add(db_register_user)
        db.commit()


        # Create a subscription record for the user
        db_subscription = Models.Subscription(user_id=db_register_user.id, subscription_type=registerUser.subscription_type, credits_count=credit_count)
        db.add(db_subscription)

        db.commit()

        db.refresh(db_register_user)

    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"User Already Exist!!!")

    return db_register_user


@auth_router.put("/updatePassword", status_code=status.HTTP_200_OK)
def update_password(update_passwords: Schema.UpdatePassword, db: Session = Depends(get_db), get_current_user : Schema.loginUser = Depends(JWTTokenAuth.get_current_user)):

    user = db.query(Models.RegisterUser).filter(Models.RegisterUser.email == update_passwords.email).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriptions not found")

    if not Utils.verify_password(update_passwords.current_password, user.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Password is incorrect")

    user.password = Utils.get_password_hash(update_passwords.update_password)

    db.commit()
    db.refresh(user)

    return user

@auth_router.get("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response):
    response.delete_cookie(key="session_token")
    return {"message": "Logged out successfully"}