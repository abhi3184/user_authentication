
from models.index import UserTable
from schemas.index import User

class userLoginRepo:
    @staticmethod
    def user_login(db,req):
        result = db.execute(
            UserTable.select().where(
                (UserTable.c.username == req.login) |
                (UserTable.c.email == req.login) |
                (UserTable.c.mobile == req.login)
            )
        ).mappings().first()
        return result