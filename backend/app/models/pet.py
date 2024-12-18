# models/pet.py

from .db import db, environment, SCHEMA



class Pet(db.Model):
    __tablename__ = 'pets'

#pets table columns 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)  
    breed = db.Column(db.String(100), nullable=True)
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    color = db.Column(db.String(50), nullable=True)
    weight = db.Column(db.Float, nullable=True)
    dob = db.Column(db.Date, nullable=True)
    size = db.Column(db.String(50), nullable=True)
    behavior = db.Column(db.String(255), nullable=True)
    medication_note = db.Column(db.String(255), nullable=True)
    dietary_note = db.Column(db.String(255), nullable=True)
    preview_image = db.Column(db.String(255), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(f'{SCHEMA}.users.id' if environment == "production" else 'users.id'), nullable=False)

# relationships
    pet_images = db.relationship('PetImage', back_populates='pet', cascade="all, delete-orphan")


    def to_dict(self):
        return {                #do we want microchip id and vaccination status?
            'id': self.id,
            'name': self.name,
            'type': self.type,    
            'breed': self.breed,
            'age': self.age,
            'gender': self.gender,
            'color': self.color,
            'weight': self.weight,
            'dob': self.dob,
            'size': self.size,
            'behavior': self.behavior,
            'medication_note': self.medication_note,
            'dietary_note': self.dietary_note,
            'preview_image': self.preview_image,
            'owner_id': self.owner_id,
            'pet_images': [{"url": image.url, "id": image.id} for image in self.pet_images]
        }

