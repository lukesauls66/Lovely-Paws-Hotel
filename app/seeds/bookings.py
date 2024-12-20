from datetime import datetime, timedelta
from app.models import Booking, db, environment, SCHEMA
from sqlalchemy.sql import text
from .services import Service

def seed_bookings():
    # Create the 12 seed records
    hair_cut = Service.query.get(1)
    nail_trim = Service.query.get(2)
    simple_bath = Service.query.get(3)
    luxury_bath = Service.query.get(4)

    bookings = [
        # Booking 1 (day_care)
        Booking(
            client_id=5,
            pet_id=1,
            booking_type='day_care',
            drop_off_date=datetime.now() - timedelta(days=5),
            pick_up_date=datetime.now() - timedelta(days=5),
            services=[hair_cut, luxury_bath]
        ),
        # Booking 2 (boarding_care)
        Booking(
            client_id=6,
            pet_id=2,
            booking_type='boarding_care',
            drop_off_date=datetime.now() - timedelta(days=10),
            pick_up_date=datetime.now() + timedelta(days=2),
            services=[hair_cut, nail_trim, simple_bath]
        ),
        # Booking 3 (day_care)
        Booking(
            client_id=7,
            pet_id=3,
            booking_type='day_care',
            drop_off_date=datetime.now() - timedelta(days=8),
            pick_up_date=datetime.now() - timedelta(days=8),
            services=[hair_cut, nail_trim, luxury_bath]
        ),
        # Booking 4 (boarding_care)
        Booking(
            client_id=8,
            pet_id=4,
            booking_type='boarding_care',
            drop_off_date=datetime.now() - timedelta(days=3),
            pick_up_date=datetime.now() + timedelta(days=4),
            services=[hair_cut, nail_trim, luxury_bath]
        ),
        # Booking 5 (boarding_care)
        Booking(
            client_id=5,
            pet_id=5,
            booking_type='boarding_care',
            drop_off_date=datetime.now() + timedelta(days=10),
            pick_up_date=datetime.now() + timedelta(days=15),
            services=[hair_cut, nail_trim, simple_bath]
        ),
        # # Booking 6 (day_care)
        # Booking(
        #     client_id=6,
        #     pet_id=6,
        #     booking_type='day_care',
        #     drop_off_date=datetime.now() - timedelta(days=6),
        #     pick_up_date=datetime.now() - timedelta(days=6),
        #     services=[simple_bath]
        # ),
        # # Booking 7 (boarding_care)
        # Booking(
        #     client_id=7,
        #     pet_id=7,
        #     booking_type='boarding_care',
        #     drop_off_date=datetime.now() - timedelta(days=15),
        #     pick_up_date=datetime.now() + timedelta(days=3),
        #     services=[hair_cut, nail_trim, luxury_bath]
        # ),
        # # Booking 8 (day_care)
        # Booking(
        #     client_id=8,
        #     pet_id=8,
        #     booking_type='day_care',
        #     drop_off_date=datetime.now() - timedelta(days=2),
        #     pick_up_date=datetime.now() - timedelta(days=2),
        #     services=[nail_trim, simple_bath]
        # ),
        # # Booking 9 (boarding_care)
        # Booking(
        #     client_id=5,
        #     pet_id=9,
        #     booking_type='boarding_care',
        #     drop_off_date=datetime.now() - timedelta(days=9),
        #     pick_up_date=datetime.now() + timedelta(days=2),
        #     services=[hair_cut, nail_trim, luxury_bath]
        # ),
        # # Booking 10 (day_care)
        # Booking(
        #     client_id=6,
        #     pet_id=10,
        #     booking_type='day_care',
        #     drop_off_date=datetime.now() - timedelta(days=4),
        #     pick_up_date=datetime.now() - timedelta(days=4),
        #     services=[nail_trim, simple_bath]
        # ),
        # # Booking 11 (boarding_care)
        # Booking(
        #     client_id=7,
        #     pet_id=6,
        #     booking_type='boarding_care',
        #     drop_off_date=datetime.now() - timedelta(days=7),
        #     pick_up_date=datetime.now() + timedelta(days=5),
        #     services=[hair_cut, nail_trim, luxury_bath]
        # ),
        # # Booking 12 (day_care)
        # Booking(
        #     client_id=8,
        #     pet_id=7,
        #     booking_type='day_care',
        #     drop_off_date=datetime.now() - timedelta(days=1),
        #     pick_up_date=datetime.now() - timedelta(days=1),
        #     services=[luxury_bath]
        # ),
    ]

    # Add all bookings to the session and commit
    db.session.add_all(bookings)
    db.session.commit()

def undo_bookings():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.services RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM services"))
        
    db.session.commit()
