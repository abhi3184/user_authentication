
from models.index import UserTable
from repository.index import userRepos,UserRegistrationRepository
from sqlalchemy.orm import Session
class userService:

    @staticmethod
    def get_all_users(db: Session):
        result = userRepos.get_all_users(db)
        return result

    @staticmethod
    def get_user_by_id(db: Session, user_id):
        return userRepos.get_user_by_id(db, user_id)

    @staticmethod
    def check_user_exist_by_email(db: Session, email):
        return userRepos.get_user_by_email(db, email)

    @staticmethod
    def update_user(db: Session, user_id, payload):
        return userRepos.update_user(db, user_id, payload)

    @staticmethod
    def delete_user(db: Session, user_id):
        return userRepos.delete_user(db, user_id)
