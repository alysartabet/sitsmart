# Cleaning spreadsheet data for DB (only called once, not needed anymore; kept for reference)
import pandas as pd
import numpy as np
import uuid

# Different functions to clean up different csv files
old_file = '../spreadsheets/old-sheets/'
new_file = '../spreadsheets/new-sheets/'

def update_college_room_info():
    """
    Updating college-room-info.csv and saving file as academic-rooms.csv
    Fill NaN values with O and 'skipped' with 0 for num_computers column.
    Fill NaN values with 0 for num_whiteboards column; fixing double value to integer.
    """

    df = pd.read_csv(f'{old_file}college-room-info.csv')

    df['num_computers'] = df['num_computers'].fillna(0)
    df['num_computers'] = df['num_computers'].replace('skipped', 0)

    df['num_whiteboards'] = df['num_whiteboards'].fillna(0).astype('int64')
    df['num_computers'] = df['num_whiteboards'].astype('int64')

    df.to_csv(f'{new_file}academic-rooms.csv', index=False)

def updating_room_event():
    """
    Creating a csv file with room_id and event_id specifically for room_event table.
    Can be reused with other tables that need room_id and event_id.
    Applying lambda function to create a unique event_id for each row (using uuid4).
    """

    df = pd.read_csv(f'{old_file}academic-rooms.csv')
    df.insert(0, 'event_id', np.nan)
    df['event_id'] = df['event_id'].apply(lambda x: uuid.uuid4())

    df = df[['event_id', 'room_id']]

    df.to_csv(f'{new_file}room-event.csv', index=False)

def updating_room_rate():
    """
    Creating a csv file with room_id and event_id specifically for room_rate table.
    Can be reused with other tables that need room_id and event_id.
    Applying lambda function to create a unique event_id for each row (using uuid4).
    """

    df = pd.read_csv(f'{new_file}room-event.csv')
    df = df[['room_id', 'event_id']]

    df.to_csv(f'{new_file}room-rate.csv', index=False)

updating_room_rate()