from datetime import date
from app.models import db, Pet, environment, SCHEMA
from sqlalchemy.sql import text


def seed_pets():
    pets = [
        Pet(
            name='Buddy',
            type='Dog',
            breed='Golden Retriever',
            age=3,
            gender='Male',
            color='Golden',
            weight=68.0,
            dob=date(2020, 6, 15),
            size='Large',
            behavior='Friendly and playful',
            medication_note=None,
            dietary_note='Prefers grain-free food',
            preview_image='https://example.com/images/buddy.jpg',
            owner_id=5
        ),
        Pet(
            name='Whiskers',
            type='Cat',
            breed='Siamese',
            age=2,
            gender='Female',
            color='Cream with brown points',
            weight=9.0,
            dob=date(2021, 8, 10),
            size='Small',
            behavior='Affectionate and vocal',
            medication_note=None,
            dietary_note='Prefers wet food',
            preview_image='https://example.com/images/whiskers.jpg',
            owner_id=6
        ),
        Pet(
            name='Max',
            type='Dog',
            breed='Bulldog',
            age=4,
            gender='Male',
            color='White with brown patches',
            weight=50.0,
            dob=date(2019, 3, 25),
            size='Medium',
            behavior='Calm and loyal',
            medication_note='Takes daily supplements for joints',
            dietary_note=None,
            preview_image='https://example.com/images/max.jpg',
            owner_id=7
        ),
        Pet(
            name='Coco',
            type='Bird',
            breed='Cockatiel',
            age=1,
            gender='Female',
            color='Gray and yellow',
            weight=0.2,
            dob=date(2023, 2, 14),
            size='Small',
            behavior='Loves to whistle',
            medication_note=None,
            dietary_note=None,
            preview_image='https://example.com/images/coco.jpg',
            owner_id=8
        ),
        Pet(
            name='Luna',
            type='Cat',
            breed='Maine Coon',
            age=5,
            gender='Female',
            color='Gray and white',
            weight=12.0,
            dob=date(2018, 11, 5),
            size='Large',
            behavior='Independent but affectionate',
            medication_note=None,
            dietary_note='Requires a high-protein diet',
            preview_image='https://example.com/images/luna.jpg',
            owner_id=5
        ),
        Pet(
            name='Charlie',
            type='Dog',
            breed='Poodle',
            age=6,
            gender='Male',
            color='White',
            weight=18.0,
            dob=date(2017, 7, 22),
            size='Medium',
            behavior='Energetic and intelligent',
            medication_note='Allergy medication as needed',
            dietary_note=None,
            preview_image='https://example.com/images/charlie.jpg',
            owner_id=6
        ),
        Pet(
            name='Daisy',
            type='Rabbit',
            breed='Lop',
            age=2,
            gender='Female',
            color='Brown',
            weight=4.5,
            dob=date(2021, 9, 15),
            size='Small',
            behavior='Gentle and shy',
            medication_note=None,
            dietary_note='Prefers leafy greens',
            preview_image='https://example.com/images/daisy.jpg',
            owner_id=7
        ),
        Pet(
            name='Rocky',
            type='Dog',
            breed='German Shepherd',
            age=3,
            gender='Male',
            color='Black and tan',
            weight=75.0,
            dob=date(2020, 12, 1),
            size='Large',
            behavior='Protective and obedient',
            medication_note=None,
            dietary_note='High-protein diet',
            preview_image='https://example.com/images/rocky.jpg',
            owner_id=8
        ),
        Pet(
            name='Milo',
            type='Cat',
            breed='Bengal',
            age=4,
            gender='Male',
            color='Spotted brown',
            weight=10.0,
            dob=date(2019, 4, 17),
            size='Medium',
            behavior='Playful and active',
            medication_note=None,
            dietary_note=None,
            preview_image='https://example.com/images/milo.jpg',
            owner_id=5
        ),
        Pet(
            name='Peanut',
            type='Hamster',
            breed='Syrian',
            age=1,
            gender='Female',
            color='Golden',
            weight=0.1,
            dob=date(2023, 3, 3),
            size='Small',
            behavior='Nocturnal and curious',
            medication_note=None,
            dietary_note='Requires fresh vegetables daily',
            preview_image='https://example.com/images/peanut.jpg',
            owner_id=6
        )
    ]

    for pet in pets:
        db.session.add(pet)

    db.session.commit()

def undo_pets():
    # db.session.execute('TRUNCATE pets RESTART IDENTITY CASCADE;')
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.services RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM services"))
    db.session.commit()
