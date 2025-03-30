# Configures the DB connection
import os

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:Fu11C0w1ing@localhost:5432/sit_smart"
    SQLALCHEMY_TRACK_MODIFICATIONS = False