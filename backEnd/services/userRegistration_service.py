
from utils.GenerateOTP import generate_otp, send_email
import time
from schemas.index import EmailOTPRequest,EmailOTPVerifyRequest,MobileOTPRequest,VerifyMobileOTPRequest
from models.index import UserTable
from fastapi import APIRouter, Depends, HTTPException, Body
import requests
from utils.otp_store import reg_otp_store,reg_mobile_otp_store
from sqlalchemy import select
from utils.HashPasswor import hash_password, verify_password
from schemas.index import User
from repository.index import OTPRepository, ForgotPassRepository,UserRegistrationRepository
from sqlalchemy.orm import Session

class userRegistrationService:
    @staticmethod
    def send_email_otp(db: Session,payload: EmailOTPRequest):
        user = UserRegistrationRepository.get_user_by_email(db,payload.email)
        if user:
            return {"success": False, "message": "Email already registerd"}
        try:
            return OTPRepository.send_email_otp(payload)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to send email OTP: {str(e)}")
        
    @staticmethod
    def verify_email_otp(db: Session,payload: EmailOTPVerifyRequest):   
        record = OTPRepository.otp_store.get(payload.email)
        if not record:
            return {"success": False, "message": "OTP not sent for this email"}

        if time.time() > record["expires_at"]:
            del OTPRepository.otp_store[payload.email]
            return {"success": False, "message": "Email OTP expired"}

        if payload.otp == record["otp"]:
            return {"success": True, "message": "OTP verified successfully"}
        return {"success": False, "message": "Invalid Email OTP"}
    
    @staticmethod
    def resend_email_otp(db: Session,payload: EmailOTPRequest):
        try:
            return OTPRepository.send_email_otp(db,payload)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to resend email OTP: {str(e)}")
        
    @staticmethod
    def send_mobile_otp(db: Session,payload: MobileOTPRequest):
        user = UserRegistrationRepository.get_user_by_mobile(db,payload.mobile)
        if user:
            return {"success": False, "message": "Mobile number alredy used"}
        try:
            return OTPRepository.send_mobile_otp(payload)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to send mobile OTP: {str(e)}")
        
    @staticmethod
    def resend_mobile_otp(db: Session,payload: MobileOTPRequest):
     return userRegistrationService.send_mobile_otp(payload)

    @staticmethod
    def verify_mobile_otp(db: Session,payload: VerifyMobileOTPRequest):
        record = OTPRepository.mobile_otp_store.get(db,payload.mobile)
        if not record:
            return {"success": False, "message": "OTP not sent for this mobile"}

        if time.time() > record["expires_at"]:
            del OTPRepository.mobile_otp_store[payload.mobile]
            return {"success": False, "message": "Mobile OTP expired"}

        if payload.otp == record["otp"]:
            return {"success": True, "message": "OTP verified successfully"}
        return {"success": False, "message": "Invalid Mobile OTP"}

    
    @staticmethod
    def post_user(db: Session, user: User):
        check = UserRegistrationRepository.check_user_exist(db, user)
        
        if check["exists"]:
            fields = ", ".join(check["conflicts"])
            return {
                "success": False,
                "data": user,
                "message": f"The following field(s) already exist: {fields}"
            }

        try:
            response = UserRegistrationRepository.post_user(db, user)
            return {
                "success": True,
                "data": response,
                "message": "User registered successfully"
            }
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Registration failed: {str(e)}"
            )