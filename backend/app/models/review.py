from .db import db, environment, SCHEMA

class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    # reviews table columns
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    review = db.Column(db.String(2000), nullable=False)
    paws = db.Column(db.Integer, nullable=False)
    # relationships:
    # client = db.relationship('User', back_populates='reviews')

    def to_dict(self):
        return {
            'id': self.id,
            'client_id': self.client_id,
            'review': self.review,
            'paws': self.paws
        }