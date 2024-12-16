from .db import db, environment, SCHEMA
# from .user import User
from .service_staff import service_staff

class Service(db.Model):
    __tablename__ = 'services'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    service = db.Column(db.String(100), nullable=False, unique=True)
    price = db.Column(db.Numeric(6, 2), nullable=False)

    staff = db.relationship(
        'User',
        secondary=service_staff,
        back_populates='services',
        lazy='joined'
    )

    def to_dict(self):
        return {
            'id': self.id,
            'service': self.service,
            'price': self.price,
            'staff': [{'id': user.id, 'fname': user.fname, 'lname': user.lname, 'email': user.email} for user in self.staff]
        }