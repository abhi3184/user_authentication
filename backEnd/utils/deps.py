from fastapi import Depends, HTTPException, Header, status
from utils.jwt_handler import decode_access_token

async def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing Authorization header",
        )
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please login again.",
        )
    
    return payload
