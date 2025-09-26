from fastapi import APIRouter, Depends, HTTPException,Security
from sqlalchemy.orm import Session
from config.db import get_db
from schemas.index import User, UserLogin, EmailOTPRequest, MobileOTPRequest, EmailOTPVerifyRequest, UpdatePasswordReq, VerifyEmailOTPRequest, VerifyMobileOTPRequest, UpdateUserRequest
from services.index import userService
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.deps import get_current_user

user = APIRouter()
bearer_scheme = HTTPBearer()

@user.get("/users")
async def get_all_users(
        current_user: dict = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
    return userService.get_all_users(db)


@user.get("/users/id/{id}")
async def get_users_by_id(id: int, db: Session = Depends(get_db)):
    return userService.get_user_by_id(db, id)


@user.get("/users/email")
async def check_user_exist_by_email(email: str, db: Session = Depends(get_db)):
    return userService.check_user_exist_by_email(db, email)
    

@user.put("/updateUser/{user_id}")
async def update_user(user_id: int, payload: UpdateUserRequest,
        current_user: dict = Depends(get_current_user),
        db: Session = Depends(get_db)):
    result = userService.update_user(db, user_id, payload)
    return result


@user.delete("/deleteUser/{user_id}")
async def delete_user(user_id: int, 
        current_user: dict = Depends(get_current_user),
        db: Session = Depends(get_db)):
    result = userService.delete_user(db, user_id)
    return result
