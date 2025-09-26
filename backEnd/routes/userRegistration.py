from fastapi import APIRouter,Depends
from schemas.index import User,EmailOTPRequest,MobileOTPRequest,VerifyEmailOTPRequest,VerifyMobileOTPRequest
from fastapi import APIRouter
from services.index import userRegistrationService
from sqlalchemy.orm import Session
from config.db import get_db

registration = APIRouter()

reg_otp_store = {} 
@registration.post("/send-email-otp")
async def send_email_otp(payload: EmailOTPRequest,db: Session = Depends(get_db)):
    return userRegistrationService.send_email_otp(db,payload)
    
@registration.post("/verify-email-otp")
async def verify_email_otp(payload: VerifyEmailOTPRequest,db: Session = Depends(get_db)):   
    return userRegistrationService.verify_email_otp(db,payload)

@registration.post("/resend-email-otp")
async def resend_email_otp(payload: EmailOTPRequest,db: Session = Depends(get_db)):
    return userRegistrationService.resend_email_otp(db,payload)

@registration.post("/send-mobile-otp")
async def send_mobile_otp(payload: MobileOTPRequest,db: Session = Depends(get_db)):
    return userRegistrationService.send_mobile_otp(db,payload)
    
@registration.post("/verify-mobile-otp")
async def verify_mobile_otp(payload: VerifyMobileOTPRequest,db: Session = Depends(get_db)):
    return userRegistrationService.verify_mobile_otp(db,payload)

@registration.post("/resend-mobile-otp")
async def resend_mobile_otp(payload: MobileOTPRequest,db: Session = Depends(get_db)):
    return userRegistrationService.resend_mobile_otp(db,payload)

@registration.post("/postuser")
async def post_user(user: User,db: Session = Depends(get_db)):
    return userRegistrationService.post_user(db,user)
