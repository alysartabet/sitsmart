# Importing CSV file to PSQL database
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

# Variable to hold the file location and connection string (connecting to PSQL with connection string)
file_loc = '../spreadsheets/new-sheets/'
connection_string = "postgresql://postgres:Fu11C0w1ing@localhost:5432/sit_smart"
engine = create_engine(connection_string)

def filling_table(csv_file, table_to_fill):
    """
    Creating a DF given a specific csv file, connecting to specific PSQL table and filling table.
    Simplified to one function to import data into DB given any file.
    """
    try:
        with engine.connect() as connection:
            with connection.begin():
                df = pd.read_csv(f'{file_loc}{csv_file}')
                df.to_sql(
                    f'{table_to_fill}',
                    con=connection,
                    if_exists='append',
                    index=False,
                )
        print("Data imported successfully.")
    except SQLAlchemyError as e:
        print(f"Error importing data: {e}")

# filling_table('academic-rooms.csv', 'room')
# filling_table('room-event.csv', 'room_event')
# filling_table('room-rate.csv', 'room_rate')