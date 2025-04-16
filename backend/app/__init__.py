# Initializes the Flask application (imports the Config class from config.py)
# Run this before starting pip install -r /path/to/requirements.txt

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config

# Initialize db
db = SQLAlchemy()

# Function that creates application
def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    db.init_app(app)

    # Registering the 'blueprints'/routes -> all the tables that will be in the DB
    from .routes import main
    app.register_blueprint(main)

    return app