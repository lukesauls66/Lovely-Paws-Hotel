from .db import db, environment, SCHEMA

booking_service = db.Table(
  'booking_service',
  db.Column('booking_id', db.Integer, db.ForeignKey(f'{SCHEMA}.bookings.id' if environment == "production" else 'bookings.id'), primary_key=True),
  db.Column('service_id', db.Integer, db.ForeignKey(f'{SCHEMA}.services.id' if environment == "production" else 'services.id'),  primary_key=True)
)

if environment == 'production':
  booking_service.schema = SCHEMA