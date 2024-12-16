from .db import db, environment, SCHEMA
from .booking_service import booking_service

class Booking(db.Model):
  __tablename__ = 'booking'

  if environment == 'production':
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
  booking_type = db.Column(db.String(50), nullable=False)
  drop_off_date = db.Column(db.DateTime, nullable=False)
  pick_up_date = db.Column(db.DateTime, nullable=False)
  cost = db.Column(db.Numeric(precision=6, scale=2), nullable=False)

  services = db.relationship(
    'Service',
    secondary=booking_service,
    back_populates='booking',
    lazy='joined'
  )

  def to_dict(self):
    return {
      'id': self.id,
      'client_id': self.clientId,
      'pet_id': self.petId,
      'booking_type': self.bookingType,
      'drop_off_date': self.dropOffDate,
      'pick_up_date': self.pickUpDate,
      'cost': self.cost,
      'services': [{
        'id': service.id,
        'type_of_service': service.type_of_service,
        'price': service.price
      } for service in self.services]
    }