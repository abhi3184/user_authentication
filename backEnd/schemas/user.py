from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str
    password: str
    mobile: str

class UserLogin(BaseModel):
    login:str
    password: str