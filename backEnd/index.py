from fastapi import FastAPI
from routes.index import user
from routes.index import forgotPass
from routes.index import registration
from routes.index import authentication

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authentication, prefix="/auth", tags=["Authentication"])
app.include_router(user, prefix="/user", tags=["User"])
app.include_router(forgotPass, prefix="/forgot-password", tags=["Forgot Password"])
app.include_router(registration, prefix="/registration", tags=["Registration"])
