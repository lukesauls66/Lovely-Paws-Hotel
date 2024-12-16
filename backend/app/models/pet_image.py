from .db import db, environment, SCHEMA

class PetImage(db.Model):
    __tablename__ = 'pet_images'

    if environment == 'production':
        table_args = {'schema': SCHEMA}

#image table columns
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    url = db.Column(db.String(300), nullable=False) #url of image

    pet = db.relationship('Pet', back_populates='pet_images')

#image to dict
    def to_dict(self):
        return {
            'id': self.id,
            'pet_id': self.pet_id,
            'url': self.url
        }