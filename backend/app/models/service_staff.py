from .db import db, environment, SCHEMA

service_staff = db.Table(
    'service_staff',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('service_id', db.Integer, db.ForeignKey('services.id'), primary_key=True)
)

if environment == "production":
    service_staff.schema = SCHEMA