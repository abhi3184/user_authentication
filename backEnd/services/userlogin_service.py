
from models.index import UserTable
from utils.HashPasswor import verify_password
from schemas.index import UserLogin
from sqlalchemy import select
from fastapi import APIRouter, HTTPException
from repository.index import userLoginRepo
from sqlalchemy.orm import Session
from utils.jwt_handler import create_access_token
class userloginService:
    @staticmethod
    def login_user(db: Session,req: UserLogin):
        user = userLoginRepo.user_login(db,req)

        if not user:
            raise HTTPException(status_code=400, detail="User not found")

        if not verify_password(req.password, user.password):
            raise HTTPException(status_code=400, detail="Incorrect password")
        token = create_access_token({"sub": user["email"], "id": user["id"]})
        return {"success": True, "user": {"id": user.id, "username": user.username},"token": token, "token_type": "bearer"}
