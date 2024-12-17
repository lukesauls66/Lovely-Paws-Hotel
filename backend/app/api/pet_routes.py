# api/pet_routes.py

from flask import Blueprint, request, jsonify
from app.models import Pet, PetImage, db
from app.forms import PetForm
from flask_login import login_required, current_user

pet_routes = Blueprint('pets', __name__)

#return list of all pets
@pet_routes.route('/', methods=['GET'])
def get_pets():
    pets = Pet.query.all()
    return jsonify({"Pets": [pet.to_dict() for pet in pets]})

#return all pets owned by current user
@pet_routes.route('/user', methods=['GET'])
@login_required
def get_user_pets():
    pets = Pet.query.filter_by(owner_id=current_user.id).all()
    return jsonify({"Pets": [pet.to_dict() for pet in pets]})

#return pet by id
@pet_routes.route('/<int:id>', methods=['GET'])
def get_pet(id):
    pet = Pet.query.get(id)
    if pet:
        return jsonify(pet.to_dict())
    return jsonify({'message': "Pet couldn't be found"}), 404

@pet_routes.route('/', methods=['POST'])
@login_required
def create_pet():
    form = PetForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        pet = Pet(
            name=form.name.data,
            type=form.type.data,
            breed=form.breed.data,
            age=form.age.data,
            gender=form.gender.data,
            color=form.color.data,
            weight=form.weight.data,
            dob=form.dob.data,
            size=form.size.data,
            behavior=form.behavior.data,
            medication_note=form.medication_note.data,
            dietary_note=form.dietary_note.data,
            owner_id=current_user.id
        )
        
        # preview image
        if form.preview_image_url.data:
            pet.preview_image = form.preview_image_url.data
        
        # additional images
        for image_url in form.image_urls.entries:
            if image_url.data:
                pet_image = PetImage(url=image_url.data, pet=pet)
                db.session.add(pet_image)
        
        db.session.add(pet)
        db.session.commit()
        return jsonify(pet.to_dict()), 201
    
    return jsonify(form.errors), 400

@pet_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_pet(id):
    pet = Pet.query.get(id)
    if not pet:
        return jsonify({'message': "Pet couldn't be found"}), 404
    
    form = PetForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        pet.name = form.name.data
        pet.type = form.type.data
        pet.breed = form.breed.data
        pet.age = form.age.data
        pet.gender = form.gender.data
        pet.color = form.color.data
        pet.weight = form.weight.data
        pet.dob = form.dob.data
        pet.size = form.size.data
        pet.behavior = form.behavior.data
        pet.medication_note = form.medication_note.data
        pet.dietary_note = form.dietary_note.data
        
        # Handle preview image
        if form.preview_image.data:
            preview_image_file = form.preview_image.data
            preview_image_path = save_file(preview_image_file)
            pet.preview_image = preview_image_path
        elif form.preview_image_url.data:
            pet.preview_image = form.preview_image_url.data
        
        # Handle additional images
        for image_file in form.images.entries:
            if image_file.data:
                image_path = save_file(image_file.data)
                pet_image = PetImage(url=image_path, pet=pet)
                db.session.add(pet_image)
        
        for image_url in form.image_urls.entries:
            if image_url.data:
                pet_image = PetImage(url=image_url.data, pet=pet)
                db.session.add(pet_image)
        
        db.session.commit()
        return jsonify(pet.to_dict())
    
    return jsonify(form.errors), 400

@pet_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_pet(id):
    pet = Pet.query.get(id)
    if not pet:
        return jsonify({'message': "Pet couldn't be found"}), 404
    
    db.session.delete(pet)
    db.session.commit()
    return jsonify({'message': 'Successfully deleted'})