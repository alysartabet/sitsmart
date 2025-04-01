# Cleaning spreadsheet data for DB importing (only called once, not needed anymore; kept for reference)
import pandas as pd
import numpy as np

def update_college_room_info():
    """
    Updating college-room-info.csv and saving file as academic-rooms.csv
    Fill NaN values with O and 'skipped' with 0 for num_computers column.
    Fill NaN values with 0 for num_whiteboards column; fixing double value to integer.
    """

    academic_rooms = pd.read_csv('../spreadsheets/old-sheets/college-room-info.csv')

    academic_rooms['num_computers'] = academic_rooms['num_computers'].fillna(0)
    academic_rooms['num_computers'] = academic_rooms['num_computers'].replace('skipped', 0)

    academic_rooms['num_whiteboards'] = academic_rooms['num_whiteboards'].fillna(0).astype('int64')
    academic_rooms['num_computers'] = academic_rooms['num_whiteboards'].astype('int64')

    academic_rooms.to_csv('../spreadsheets/academic-rooms.csv', index=False)

update_college_room_info()

# class-sections-sp25.csv