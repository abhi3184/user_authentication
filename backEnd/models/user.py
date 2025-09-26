from sqlalchemy import Table, Column, Integer, String

from config.db import meta

UserTable = Table(
    "users", meta,
    Column("id", Integer, primary_key=True),   
    Column("username", String(50), unique=True, nullable=False),
    Column("email", String(100), unique=True, nullable=False),
    Column("password", String(100), nullable=False),
    Column("mobile", String(15), unique=True, nullable=False))