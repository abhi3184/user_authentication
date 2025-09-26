from fastapi import APIRouter,Depends
from schemas.index import UserLogin
from services.index import userloginService
from sqlalchemy.orm import Session
from config.db import get_db

authentication = APIRouter()

@authentication.post("/login")
async def login_user(login_user: UserLogin,db: Session = Depends(get_db)):
    return userloginService.login_user(db,login_user)
