
from models.index import UserTable
from sqlalchemy import select
from schemas.index import MobileOTPRequest

class ForgotPassRepository:
    @staticmethod
    def get_user_by_email(db,email: str):
        return db.execute(UserTable.select().where(UserTable.c.email == email)).mappings().first()

    @staticmethod
    def update_user(db,user_id: int, data: dict):
        return db.execute(UserTable.update().where(UserTable.c.id == user_id).values(**data))
    
    @staticmethod
    def get_user_by_mobile(db,payload):
        print("mobile",payload)
        result = db.execute(
            select(UserTable).where(UserTable.c.mobile == payload)
            ).mappings().first()
        print("result",result)
        return result
    
    @staticmethod
    def update_password(db,email, password):
        from utils.HashPasswor import hash_password
        hashed_pw = hash_password(password)
        db.execute(UserTable.update().where(UserTable.c.email == email).values(password=hashed_pw))
        db.commit()
        return {"success": True, "message": "Password updated successfully"}
