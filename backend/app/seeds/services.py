from app.models import db, Service, environment, SCHEMA
from sqlalchemy.sql import text
from .users import User

def seed_services():
    staff_5 = User.query.get(5)
    staff_6 = User.query.get(6)
    staff_7 = User.query.get(7)
    
    staff_8 = User.query.get(8)
    staff_9 = User.query.get(9)
    staff_10 = User.query.get(10)
    
    staff_11 = User.query.get(11)
    staff_12 = User.query.get(12)
    staff_13 = User.query.get(13)

    hair_cut = Service(
        service="hair cut", price=57.99, staff=[staff_5, staff_6, staff_7]
    )
    nail_trim = Service(
        service="nail trim", price=34.99, staff=[staff_8, staff_9, staff_10]
    )
    bath = Service(
        service="bath", price=48.99, staff=[staff_11, staff_12, staff_13]
    )

    db.session.add(hair_cut)
    db.session.add(nail_trim)
    db.session.add(bath)
    db.session.commit()

def undo_services():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.services RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM services"))
        
    db.session.commit()