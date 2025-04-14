# Displays the API routes where you can view all the tables in the DB
from flask import Blueprint
from . import db
from .models import *
from dotenv import load_dotenv
from urllib.parse import urlparse
import psycopg2
import os

load_dotenv()
main = Blueprint('main', __name__)

# Function to connect to database -> returns the PSQL connection object
def db_conn():
    """Grabs the connection string from the environment variable and returns a connection object."""
    connection_string = os.getenv("DATABASE_URL")
    p = urlparse(connection_string)
    pg_connection_dict = {
        "host": p.hostname,
        "port": p.port,
        "user": p.username,
        "password": p.password,
        "database": p.path[1:],
    }
    conn = psycopg2.connect(**pg_connection_dict)
    return conn


# Using API calls for CRUD operations
@main.route('/')
def index():
    """Main route/home screen for the Sit Smart App"""
    return "Welcome to the Smart Room API!"


