from flask import Blueprint, request, jsonify 
from app.models import Pet, PetImage, db
from app.forms import PetForm
from flask_login import current_user

pet_routes = Blueprint('pets', __name__)

# Return list of all pets
@pet_routes.route('/', methods=['GET'])
def get_pets():
    pets = Pet.query.all()
    return jsonify({"Pets": [pet.to_dict() for pet in pets]})

# Return all pets owned by current user
@pet_routes.route('/user', methods=['GET'])
def get_user_pets():
    if not current_user.is_authenticated:
        return jsonify({'message': 'User not authenticated'}), 401

    pets = Pet.query.filter(Pet.owner_id == current_user.id).all()
    pets_dict = [pet.to_dict() for pet in pets]
    return jsonify({"Pets": pets_dict})

# Return pet by id
@pet_routes.route('/<int:id>', methods=['GET'])
def get_pet(id):
    pet = Pet.query.get(id)
    if pet:
        return jsonify(pet.to_dict())
    return jsonify({'message': 'Pet not found'}), 404

# Create pet
@pet_routes.route('/', methods=['POST'])
def create_pet():
    form = PetForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_pet = Pet(
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
            new_pet.preview_image = form.preview_image_url.data

        data = request.get_json()
        image_urls = data.get('image_urls', [])
        
        # additional images
        for url in image_urls:
            if url:
                pet_image = PetImage(url=url, pet=new_pet)
                db.session.add(pet_image)

        db.session.add(new_pet)
        db.session.commit()
        return jsonify(new_pet.to_dict()), 201
    
    print(form.errors)  
    return jsonify(form.errors), 400

# Update pet
@pet_routes.route('/<int:id>', methods=['PUT'])
def update_pet(id):
    pet = Pet.query.get(id)
    if not pet:
        return jsonify({'message': "Pet couldn't be found"}), 404

    if not current_user.is_authenticated or (pet.owner_id != current_user.id and not current_user.staff):
        return jsonify({'message': 'Unauthorized'}), 403

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
        pet.preview_image = form.preview_image_url.data
        pet.owner_id = current_user.id  

        data = request.get_json()
        image_urls = data.get('image_urls', [])

        # Add new images
        for url in image_urls:
            if url and url not in [img.url for img in pet.pet_images]:
                pet_image = PetImage(url=url, pet=pet)
                db.session.add(pet_image)

        db.session.commit()
        return jsonify(pet.to_dict()), 200

    print(form.errors)  
    return jsonify(form.errors), 400

# Delete pet
@pet_routes.route('/<int:id>', methods=['DELETE'])
def delete_pet(id):
    if not current_user.is_authenticated:
        return jsonify({'message': 'User not authenticated'}), 401

    pet = Pet.query.get(id)
    if not pet:
        return jsonify({'message': "Pet couldn't be found"}), 404

    if pet.owner_id != current_user.id and not current_user.staff:
        return jsonify({'message': 'Unauthorized'}), 403
    
    db.session.delete(pet)
    db.session.commit()
    return jsonify({'message': 'Successfully deleted'})

# Delete pet image
@pet_routes.route('/<int:id>/images/<int:image_id>', methods=['DELETE'])
def delete_pet_image(id, image_id):
    pet_image = PetImage.query.get(image_id)
    if not pet_image:
        return jsonify({'message': "Image couldn't be found"}), 404

    if pet_image.pet_id != id:
        return jsonify({'message': 'Invalid image for the specified pet'}), 400

    pet = Pet.query.get(id)
    if not pet or (pet.owner_id != current_user.id and not current_user.staff):
        return jsonify({'message': 'Unauthorized'}), 403
    
    db.session.delete(pet_image)
    db.session.commit()
    return jsonify({'message': 'Successfully deleted'})