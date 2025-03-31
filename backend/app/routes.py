# Displays the API routes where you can view all the tables in the DB
from flask import Blueprint, jsonify, request
from . import db
from .models import Buildings

main = Blueprint('main', __name__)

# Using API calls for CRUD operations
@main.route('/')
def index():
    return "Welcome to the API!"