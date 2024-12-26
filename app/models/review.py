from .db import db, environment, SCHEMA
from datetime import datetime, timezone

class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(
        db.Integer,
        db.ForeignKey(f'{SCHEMA}.users.id' if environment == "production" else 'users.id'),
        nullable=False
    )
    review = db.Column(db.String(2000), nullable=False)
    paws = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    client = db.relationship('User', back_populates='reviews')

    def to_dict(self):
        return {
            'id': self.id,
            'client_id': self.client_id,
            'client_username': self.client.username if self.client else None,
            'review': self.review,
            'paws': self.paws,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }