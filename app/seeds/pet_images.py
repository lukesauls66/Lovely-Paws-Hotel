from app.models import db, PetImage, environment, SCHEMA

def seed_pet_images():
    pet_images = [
        PetImage(pet_id=1, url='https://example.com/images/placeholder1_1.jpg'),
        PetImage(pet_id=1, url='https://example.com/images/placeholder1_2.jpg'),
        PetImage(pet_id=1, url='https://example.com/images/placeholder1_3.jpg'),
        PetImage(pet_id=1, url='https://example.com/images/placeholder1_4.jpg'),
        PetImage(pet_id=1, url='https://example.com/images/placeholder1_5.jpg'),
        
        PetImage(pet_id=2, url='https://example.com/images/placeholder2_1.jpg'),
        PetImage(pet_id=2, url='https://example.com/images/placeholder2_2.jpg'),
        PetImage(pet_id=2, url='https://example.com/images/placeholder2_3.jpg'),
        PetImage(pet_id=2, url='https://example.com/images/placeholder2_4.jpg'),
        PetImage(pet_id=2, url='https://example.com/images/placeholder2_5.jpg'),
        
        PetImage(pet_id=3, url='https://example.com/images/placeholder3_1.jpg'),
        PetImage(pet_id=3, url='https://example.com/images/placeholder3_2.jpg'),
        PetImage(pet_id=3, url='https://example.com/images/placeholder3_3.jpg'),
        PetImage(pet_id=3, url='https://example.com/images/placeholder3_4.jpg'),
        PetImage(pet_id=3, url='https://example.com/images/placeholder3_5.jpg'),
        
        PetImage(pet_id=4, url='https://example.com/images/placeholder4_1.jpg'),
        PetImage(pet_id=4, url='https://example.com/images/placeholder4_2.jpg'),
        PetImage(pet_id=4, url='https://example.com/images/placeholder4_3.jpg'),
        PetImage(pet_id=4, url='https://example.com/images/placeholder4_4.jpg'),
        PetImage(pet_id=4, url='https://example.com/images/placeholder4_5.jpg'),
        
        PetImage(pet_id=5, url='https://example.com/images/placeholder5_1.jpg'),
        PetImage(pet_id=5, url='https://example.com/images/placeholder5_2.jpg'),
        PetImage(pet_id=5, url='https://example.com/images/placeholder5_3.jpg'),
        PetImage(pet_id=5, url='https://example.com/images/placeholder5_4.jpg'),
        PetImage(pet_id=5, url='https://example.com/images/placeholder5_5.jpg'),
        
        PetImage(pet_id=6, url='https://example.com/images/placeholder6_1.jpg'),
        PetImage(pet_id=6, url='https://example.com/images/placeholder6_2.jpg'),
        PetImage(pet_id=6, url='https://example.com/images/placeholder6_3.jpg'),
        PetImage(pet_id=6, url='https://example.com/images/placeholder6_4.jpg'),
        PetImage(pet_id=6, url='https://example.com/images/placeholder6_5.jpg'),
        
        PetImage(pet_id=7, url='https://example.com/images/placeholder7_1.jpg'),
        PetImage(pet_id=7, url='https://example.com/images/placeholder7_2.jpg'),
        PetImage(pet_id=7, url='https://example.com/images/placeholder7_3.jpg'),
        PetImage(pet_id=7, url='https://example.com/images/placeholder7_4.jpg'),
        PetImage(pet_id=7, url='https://example.com/images/placeholder7_5.jpg'),
        
        PetImage(pet_id=8, url='https://example.com/images/placeholder8_1.jpg'),
        PetImage(pet_id=8, url='https://example.com/images/placeholder8_2.jpg'),
        PetImage(pet_id=8, url='https://example.com/images/placeholder8_3.jpg'),
        PetImage(pet_id=8, url='https://example.com/images/placeholder8_4.jpg'),
        PetImage(pet_id=8, url='https://example.com/images/placeholder8_5.jpg'),
        
        PetImage(pet_id=9, url='https://example.com/images/placeholder9_1.jpg'),
        PetImage(pet_id=9, url='https://example.com/images/placeholder9_2.jpg'),
        PetImage(pet_id=9, url='https://example.com/images/placeholder9_3.jpg'),
        PetImage(pet_id=9, url='https://example.com/images/placeholder9_4.jpg'),
        PetImage(pet_id=9, url='https://example.com/images/placeholder9_5.jpg'),
        
        PetImage(pet_id=10, url='https://example.com/images/placeholder10_1.jpg'),
        PetImage(pet_id=10, url='https://example.com/images/placeholder10_2.jpg'),
        PetImage(pet_id=10, url='https://example.com/images/placeholder10_3.jpg'),
        PetImage(pet_id=10, url='https://example.com/images/placeholder10_4.jpg'),
        PetImage(pet_id=10, url='https://example.com/images/placeholder10_5.jpg')
    ]

    for pet_image in pet_images:
        db.session.add(pet_image)

    db.session.commit()

def undo_pet_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.pet_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM pet_images")
    db.session.commit()