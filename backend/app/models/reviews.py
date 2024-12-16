from .db import db, environment, SCHEMA

class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    review = db.Column(db.String(2000), nullable=False)
    stars = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'client_id': self.client_id,
            'review': self.review,
            'stars': self.stars
        }