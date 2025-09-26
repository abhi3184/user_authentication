
from models.index import UserTable
from schemas.index import User
from sqlalchemy import or_
from sqlalchemy import select
from utils.HashPasswor import hash_password

class UserRegistrationRepository:

    @staticmethod
    def get_user_by_email(db,email: str):
        return db.execute(UserTable.select().where(UserTable.c.email == email)).mappings().first()
    
    @staticmethod
    def get_user_by_mobile(db,mobile: str):
        return db.execute(UserTable.select().where(UserTable.c.mobile == mobile)).mappings().first()

    @staticmethod
    def check_user_exist(db, user: User):
        result = db.execute(
            UserTable.select().where(
                or_(
                    UserTable.c.email == user.email,
                    UserTable.c.username == user.username,
                    UserTable.c.mobile == user.mobile
                )
            )
        ).mappings().first()

        if not result:
            return None  # no conflict
        conflicts = []
        if result['email'] == user.email:
            conflicts.append("email")
        if result['username'] == user.username:
            conflicts.append("username")
        if result['mobile'] == user.mobile:
            conflicts.append("mobile")
        return {"exists": True, "conflicts": conflicts}

    
    @staticmethod
    def post_user(db,user):
        hashed_pw = hash_password(user.password)

        result = db.execute(
            UserTable.insert().values(
                username=user.username,
                email=user.email,
                password=hashed_pw,
                mobile=user.mobile,
            )
        )
        db.commit()

        inserted_id = result.lastrowid
        new_user = db.execute(
            select(UserTable).where(UserTable.c.id == inserted_id)
        ).mappings().first()

        return {
            "success": True,
            "data": new_user,
            "message": "User registered successfully",
        }


