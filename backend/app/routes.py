# Displays the API routes where you can view all the tables in the DB
from flask import Blueprint, request, jsonify
from . import db
from .models import *
from dotenv import load_dotenv
from urllib.parse import urlparse
from werkzeug.security import generate_password_hash
import psycopg2
import os

load_dotenv()
main = Blueprint('main', __name__)

@main.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')

    if not (full_name and email and password):
        return jsonify({"message": "Missing required fields"}), 400

    conn = db_conn()
    cursor = conn.cursor()

    # Check if user already exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"message": "User already exists"}), 409

    # Hash password and insert new user
    hashed_pw = generate_password_hash(password)
    cursor.execute(
        "INSERT INTO users (full_name, email, password) VALUES (%s, %s, %s)",
        (full_name, email, hashed_pw)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "User created successfully"}), 201

# Function to connect to database -> returns the PSQL connection object
def db_conn():
    """Grabs the connection string from the environment variable and returns a connection object."""

    # TODO: Change localhost of DB to a different host (IP address) when testing application

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
    return jsonify({"message": "Welcome to the Sit Smart App API!"}), 200

@main.route('/room-availability', methods=['GET'])
def get_room_availability():
    """Get the availability of rooms."""
    conn = db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM room_availability")
    columns = cursor.description
    result = []
    for val in cursor.fetchall():
        result.append(dict(zip([col[0] for col in columns], val)))
    cursor.close()
    conn.close()

    return result, 200