# Represents the tables being added to the database
from . import db
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID

# TODO: Fix columns as needed (in futu
# TODO: Update tables to contain values collected from spreadsheets (availability, buildings, etc.)


class Buildings(db.Model):
    """Buildings Table - building_id (primary key), building_name"""
    __tablename__ = 'building'

    building_id = db.Column(db.String(4), primary_key=True, nullable=False)
    building_name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f'<Building {self.building_id}>'
    
class Rooms(db.Model):
    """Rooms Table - room_id (primary key), room_num, building_id (foreign key), room_type, room_capacity, num_computers, num_whiteboards, rating"""
    __tablename__ = 'room'

    room_id = db.Column(db.String(10), primary_key=True, nullable=False)
    room_num = db.Column(db.Integer, nullable=False)
    building_id = db.Column(db.String(4), db.ForeignKey('building.building_id'), nullable=False)
    room_type = db.Column(db.String(15))
    room_capacity = db.Column(db.Integer, default=0)
    num_computers = db.Column(db.Integer, default=0)
    num_whiteboards = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0.0)

    def __repr__(self):
        return f'<Room {self.room_id}>'


class RoomRate(db.Model):
    """RoomRate Table - room_id (foreign key), event_id (foreign key), event_rate, noise_rate, equipment_rate
    ONLY UPDATE WHEN EVENT IS MADE."""
    __tablename__ = 'room_rate'

    room_id = db.Column(db.String(10), db.ForeignKey('room.room_id'), primary_key=True, nullable=False)
    event_id = db.Column(UUID(as_uuid=True), db.ForeignKey('room_event.event_id'), primary_key=True, nullable=False)
    event_rate = db.Column(db.Float, default=0.0)
    noise_rate = db.Column(db.Float, default=0.0)
    equipment_rate = db.Column(db.Float, default=0.0)

    def __repr__(self):
        return f'<RoomRate {self.room_id}>'


class RoomEvent(db.Model):
    """Room Event Table - event_id (primary key), room_id (foreign key), event_name, event_organizer, organizer_id, is_faculty
    ONLY UPDATE WHEN EVENT IS MADE."""
    __tablename__ = 'room_event'

    event_id = db.Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    room_id = db.Column(db.String(10), db.ForeignKey('room.room_id'), nullable=False)
    event_name = db.Column(db.String(75), nullable=True)
    event_organizer = db.Column(db.String(75), nullable=True)
    organizer_id = db.Column(db.String(10), nullable=True)
    is_faculty = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<RoomEvent {self.event_id}>'


class RoomAvailability(db.Model):
    """Room Availability Table - room_id (foreign key), event_id (foreign key), event_day, event_date, start_time, end_time, available"""
    __tablename__ = 'room_availability'

    room_id = db.Column(db.String(10), db.ForeignKey('room.room_id'), primary_key=True, nullable=False)
    event_id = db.Column(UUID(as_uuid=True), db.ForeignKey('room_event.event_id'), primary_key=True, nullable=False)
    event_day = db.Column(db.String(10), nullable=False)
    event_date = db.Column(db.Date, nullable=True)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    available = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<RoomAvailability {self.room_id}>'


# class Department(db.Model):
#     """Department Table - department_id (primary key), department_name"""
#     __tablename__ = 'department'

#     dept_id = db.Column(db.String(5), primary_key=True, nullable=False)
#     dept_name = db.Column(db.String(50), nullable=False)

#     def __repr__(self):
#         return f'<Department {self.department_id}>'


class Course(db.Model):
    """Course Table - course_id (primary key), event_id (foreign key), dept_id (foreign key), course_name"""
    __tablename__ = 'course'

    course_id = db.Column(db.String(20), primary_key=True, nullable=False)
    event_id = db.Column(UUID(as_uuid=True), db.ForeignKey('room_event.event_id'), nullable=False)
    course_name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Course {self.course_id}>'


class Faculty(db.Model):
    """Faculty Table - faculty_id (primary key), dept_id (foreign key), faculty_name, faculty_email, facutly_type, override_access"""
    __tablename__ = 'faculty'

    faculty_id = db.Column(db.String(10), primary_key=True, nullable=False)
    faculty_name = db.Column(db.String(75), nullable=False)
    faculty_email = db.Column(db.String(100), nullable=False)
    faculty_type = db.Column(db.String(15), nullable=False)
    override_access = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<Faculty {self.faculty_id}>'


class Student(db.Model):
    """Student Table - student_id (primary key), student_name, student_email, student_type"""
    __tablename__ = 'student'

    student_id = db.Column(db.String(10), primary_key=True, nullable=False)
    student_name = db.Column(db.String(75), nullable=False)
    student_email = db.Column(db.String(100), nullable=False)
    on_e_board = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Student {self.student_id}>'
