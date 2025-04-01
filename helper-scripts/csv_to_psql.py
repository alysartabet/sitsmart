# Importing CSV file to PSQL database
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

academic_rooms = pd.read_csv('../spreadsheets/academic-rooms.csv')

connection_string = "postgresql://postgres:Fu11C0w1ing@localhost:5432/sit_smart"
engine = create_engine(connection_string)

try:
    with engine.connect() as connection:
        with connection.begin():
            academic_rooms.to_sql(
                'room',
                con=connection,
                if_exists='append',
                index=False,
            )
    print("Data imported successfully.")
except SQLAlchemyError as e:
    print(f"Error importing data: {e}")