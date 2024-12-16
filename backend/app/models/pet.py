# models/pet.py

from .db import db

class Pet(db.Model):
    __tablename__ = 'pets'

#pets table columns 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)  #!species?
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
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#relationships
    owner = db.relationship('User', back_populates='pets')
    appointments = db.relationship('Appointment', back_populates='pet', lazy='joined')
    medical_records = db.relationship('MedicalRecord', back_populates='pet', lazy='joined')
    pet_images = db.relationship('PetImage', back_populates='pet', lazy='joined')


    def to_dict(self):
        return {                #do we want microchip id and vaccination status?
            'id': self.id,
            'name': self.name,
            'type': self.type,    #!species?
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
            'pet_images': [image.to_dict() for image in self.pet_images]
        }

class PetImage(db.Model):
    __tablename__ = 'pet_images'

#image table columns
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    url = db.Column(db.String(255), nullable=False) #url of image

    pet = db.relationship('Pet', back_populates='pet_images')

#image to dict
    def to_dict(self):
        return {
            'id': self.id,
            'pet_id': self.pet_id,
            'url': self.url
        }