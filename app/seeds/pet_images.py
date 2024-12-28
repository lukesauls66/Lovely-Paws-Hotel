from app.models import db, PetImage, environment, SCHEMA

def seed_pet_images():
    pet_images = [
        PetImage(pet_id=1, url='https://i.ibb.co/6t9vMfT/king-6.webp'),
        PetImage(pet_id=1, url='https://i.ibb.co/QmfNhHJ/king-1.jpg'),
        PetImage(pet_id=1, url='https://i.ibb.co/KL7GStk/king-2.jpg'),
        PetImage(pet_id=1, url='https://i.ibb.co/Db3HzsT/king-3.jpg'),
        
        PetImage(pet_id=2, url='https://i.ibb.co/Yd1NHXF/Kilo-2.jpg'),
        PetImage(pet_id=2, url='https://i.ibb.co/8XDm0vD/Kilo-3.jpg'),
        PetImage(pet_id=2, url='https://i.ibb.co/9Y0XpfT/Kilo-4.jpg'),
        PetImage(pet_id=2, url='https://i.ibb.co/mhh9jLK/Kilo-5.jpg'),
        
        PetImage(pet_id=3, url='https://i.ibb.co/TKB7sSz/Zeus-4.jpg'),
        PetImage(pet_id=3, url='https://i.ibb.co/xsyrMpy/Zeus-3.jpg'),
        PetImage(pet_id=3, url='https://i.ibb.co/mcC62Bw/Zeus-2.jpg'),
        PetImage(pet_id=3, url='https://i.ibb.co/NTCQXRG/Zeus-1.jpg'),
        
        PetImage(pet_id=4, url='https://i.ibb.co/FhVrF1W/Alex-dog-5.jpg'),
        PetImage(pet_id=4, url='https://i.ibb.co/yp3LktJ/Alex-dog-3.jpg'),
        PetImage(pet_id=4, url='https://i.ibb.co/rs7n2Ys/Alex-dog-2.jpg'),
        PetImage(pet_id=4, url='https://i.ibb.co/6RTXZQN/Alex-dog-1.jpg'),
        
        PetImage(pet_id=5, url='https://i.ibb.co/4tWrTwH/bella-4.jpg'),
        PetImage(pet_id=5, url='https://i.ibb.co/1dBJ6pQ/bella-3.jpg'),
        PetImage(pet_id=5, url='https://i.ibb.co/D8z280F/bella-1.jpg'),
        PetImage(pet_id=5, url='https://i.ibb.co/HTDsCJR/bella-2.jpg'),
        
        PetImage(pet_id=6, url='https://i.ibb.co/JpjF8DV/cosmo-2.jpg'),
        PetImage(pet_id=6, url='https://i.ibb.co/xCWP2kb/cosmo-3.jpg'),
        PetImage(pet_id=6, url='https://i.ibb.co/vPgtmBN/cosmo-4.jpg'),
        PetImage(pet_id=6, url='https://i.ibb.co/tZST4C5/cosmo-5.jpg'),
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