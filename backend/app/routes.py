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

# Function to connect to database
# def db_conn():
#     conn = psycopg2.connect(urlPa

# Using API calls for CRUD operations
@main.route('/')
def index():
    return "Welcome to the API!"
