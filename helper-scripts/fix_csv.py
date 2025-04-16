# Cleaning spreadsheet data for DB (only called once, not needed anymore; kept for reference)
import pandas as pd
import numpy as np
import uuid
from datetime import datetime

# Different functions to clean up different csv files
old_file = '../spreadsheets/old-sheets/'
new_file = '../spreadsheets/new-sheets/'

def clean_college_room_info():
    """
    Cleaning college-room-info.csv and saving file as academic-rooms.csv
    Fill NaN values with O and 'skipped' with 0 for num_computers column.
    Fill NaN values with 0 for num_whiteboards column; fixing double value to integer.
    """

    df = pd.read_csv(f'{old_file}college-room-info.csv')

    df['num_computers'] = df['num_computers'].fillna(0)
    df['num_computers'] = df['num_computers'].replace('skipped', 0)

    df['num_whiteboards'] = df['num_whiteboards'].fillna(0).astype('int64')
    df['num_computers'] = df['num_whiteboards'].astype('int64')

    df.to_csv(f'{new_file}academic-rooms.csv', index=False)

def clean_courses_info():
    """
    Cleaning class-sections-sp25.csv and saving file as courses.csv.
    Generating random UUIDs for event_id.
    Adding course events to room_event table given specific room_id. 
    """

    df = pd.read_csv(f'{old_file}class-sections-sp25.csv')
    df = df[['course_id', 'course_name', 'building_code', 'room_num']]
    df.sort_values(by=['building_code', 'room_num'], inplace=True)

    df['course_id'] = df['course_id'].str.replace(' ', '')
    df['course_id'] = df['course_id'].str.replace('/', '-')
    df['room_id'] = df['building_code'] + df['room_num'].astype(str)

    df.insert(1, 'event_id', np.nan)
    df['event_id'] = df['event_id'].apply(lambda x: uuid.uuid4())

    # df.to_csv(f'{new_file}courses.csv', index=False)


def clean_room_event_info():
    """
    Grabbing event_id and room_id from courses.csv.
    event_name will be used to add current course names to room_event table.
    """

    df = pd.read_csv(f'{new_file}courses.csv')[['event_id', 'room_id', 'course_name']]
    df.rename(columns={'course_name': 'event_name'}, inplace=True)
    df.replace('MC2611', 'MC26011', inplace=True)
    df['event_organizer'] = 'N/A'
    df['organizer_id'] = 'N/A'
    df['is_faculty'] = True

    df.to_csv(f'{new_file}room-event.csv', index=False)

clean_room_event_info()


def clean_course_input_info():
    """
    Cleaning courses.csv and saving file as course-input.csv.
    Removing building_code, room_num, room_id columns.
    """
    
    df = pd.read_csv(f'{new_file}courses.csv')
    df = df[['course_id', 'event_id', 'course_name']].drop_duplicates(subset=['course_id'])
    
    # print(df[df['course_id'].duplicated() == True])

    df.to_csv(f'{new_file}course-input.csv', index=False)
    
clean_course_input_info()

def clean_room_availability_info():
    """
    Using room-event.csv and class-sections-sp25.csv to create room-availability.csv.
    Getting room_id, event_id, event_day, start_time, end_time columns.
    Available column changes depending on if the room is available or not.
    """

    room_events = pd.read_csv(f'{new_file}room-event.csv')[['room_id', 'event_id']]
    class_sections = pd.read_csv(f'{old_file}class-sections-sp25.csv')[['event_day', 'start_time', 'end_time']]
    room_availability = pd.merge(room_events, class_sections, left_index=True, right_index=True)
    
    room_availability['available'] = False
    room_availability.to_csv(f'{new_file}room-availability.csv', index=False)

clean_room_availability_info()

