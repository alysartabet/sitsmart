# Runs the application
from app import create_app, db
from flask_migrate import Migrate

app = create_app()
migrate = Migrate(app, db)

# Create the database and tables if they don't exist (only done when app context pushed)
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)