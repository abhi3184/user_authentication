
from models.index import UserTable
from schemas.index import User

class userRepos:

    @staticmethod
    def get_all_users(db):
        result = db.execute(UserTable.select()).mappings().all()
        return result
    
    @staticmethod
    def get_user_by_id(db, user_id):
        return db.execute(UserTable.select().where(UserTable.c.id == user_id)).mappings().first()
    
    @staticmethod
    def get_user_by_email(db, email):
        return db.execute(UserTable.select().where(UserTable.c.email == email)).mappings().first()
    
    @staticmethod
    def update_user(db, user_id, payload):
        query = UserTable.update().where(UserTable.c.id == user_id).values(**payload.dict())
        db.execute(query)
        db.commit()
        return {"success": True}

    @staticmethod
    def delete_user(db, user_id):
        query = UserTable.delete().where(UserTable.c.id == user_id)
        db.execute(query)
        db.commit()
        return {"success": True}
