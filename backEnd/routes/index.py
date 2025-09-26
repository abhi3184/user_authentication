from routes.user import user
from routes.forgotPass import forgotPass
from routes.userRegistration import registration
from routes.userLogin import authentication


all_routes = [
    user,
    forgotPass,
    registration,
    authentication
]