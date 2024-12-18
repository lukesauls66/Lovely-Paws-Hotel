from .db import db, environment, SCHEMA

service_staff = db.Table(
    'service_staff',
    db.Column('user_id', db.Integer, db.ForeignKey(f'{SCHEMA}.users.id' if environment == "production" else 'users.id'), primary_key=True),
    db.Column('service_id', db.Integer, db.ForeignKey(f'{SCHEMA}.services.id' if environment == "production" else 'services.id'), primary_key=True)
)

if environment == "production":
    service_staff.schema = SCHEMA