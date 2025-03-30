# Displays the API routes where you can view all the tables in the DB
from flask import Blueprint, jsonify, request
from . import db
from .models import User

main = Blueprint('main', __name__)

# Using API calls for CRUD operations
@main.route('/')
def index():
    return "Welcome to the API!"

@main.route('/users')
def get_users():
    return "Users endpoint"

# @main.route('/users', methods=['POST'])
# def create_user():
#     data = request.get_json()
#     new_user = User(username=data['username'], email=data['email'])
#     db.session.add(new_user)
#     db.session.commit()
#     return jsonify({'id': new_user.id, 'username': new_user.username, 'email': new_user.email}), 201