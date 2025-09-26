import time
import requests
from utils.GenerateOTP import send_email, generate_otp
from models.index import UserTable



class OTPRepository:
    otp_store = {}
    mobile_otp_store = {}

    @staticmethod
    def send_email_otp(payload):
        otp = generate_otp()
        expires_at = time.time() + 300
        send_email(payload.email, otp)
        OTPRepository.otp_store[payload.email] = {"otp": otp, "expires_at": expires_at}
        return {"success": True, "message": "OTP sent successfully", "otp": otp, "expires_at": expires_at}
    
    @staticmethod
    def send_mobile_otp(payload):
        otp = generate_otp()
        expires_at = time.time() + 300
        AUTH_KEY = "469694A8hzS6VaS68cbe45eP1"
        SENDER_ID = "1233"
        ROUTE = "4"
        MOBILE = payload.mobile
        MESSAGE = f"Your OTP is {otp}"
        url = f"https://api.msg91.com/api/sendhttp.php?authkey={AUTH_KEY}&mobiles={MOBILE}&message={MESSAGE}&sender={SENDER_ID}&route={ROUTE}&country=91"
        response = requests.get(url)
        OTPRepository.mobile_otp_store[MOBILE] = {"otp": otp, "expires_at": expires_at}
        return {"success": True, "message": "OTP sent successfully", "otp": otp, "expires_at": expires_at}
    
    

