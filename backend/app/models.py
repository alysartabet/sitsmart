# Represents the tables being added to the database
from . import db
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID

# Buildings Table - building_id (primary key), building_name
class Buildings(db.Model):
    __tablename__ = 'building'

    building_id = db.Column(db.String(4), primary_key=True, nullable=False)
    building_name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f'<Building {self.building_id}>'
    
# Rooms Table - room_id (primary key), room_num, building_id (foreign key), room_type, room_capacity, num_computers, num_whiteboards, rating
class Rooms(db.Model):
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

# Room Rate - room_id (foreign key), event_id, event_rate, noise_rate, equipment_rate

# Room Event - event_id (primary key), room_id (foreign key), event_name, event_organizer, organizer_id, is_faculty)
class RoomEvent(db.Model):
    __tablename__ = 'room_event'

    event_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    room_id = db.Column(db.String(10), db.ForeignKey('room.room_id'), nullable=False)
    event_name = db.Column(db.String(50), nullable=False)
    event_organizer = db.Column(db.String(75), nullable=False)
    organizer_id = db.Column(db.String(75), nullable=False)
    is_faculty = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<RoomEvent {self.event_id}>'

# Room Availability
# Department
# Course
# Faculty
# Student
