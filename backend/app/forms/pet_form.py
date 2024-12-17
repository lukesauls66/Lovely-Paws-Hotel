# forms/pet_form.py

from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField, DateField, SelectField, RadioField, FileField, FieldList
from wtforms.validators import DataRequired, ValidationError
from app.models import Pet

# def pet_name_exists(form, field):
#     name = field.data
#     owner_id = form.data['owner_id']
#     pet = Pet.query.filter(Pet.name == name, Pet.owner_id == owner_id).first()
#     if pet:
#         raise ValidationError('Pet with this name already exists for the owner.')

# def validate_images(form, field):
#     if not form.preview_image.data and not any(form.images):
#         raise ValidationError('At least one image is required.')
#     if len(form.images) > 4:
#         raise ValidationError('No more than four additional images are allowed.')

class PetForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    type = SelectField('type', choices=[('cat', 'Cat'), ('dog', 'Dog')], validators=[DataRequired()])
    breed = StringField('breed', validators=[DataRequired()])
    age = IntegerField('age', validators=[DataRequired()])
    gender = RadioField('gender', choices=[('male', 'Male'), ('female', 'Female')], validators=[DataRequired()])
    color = StringField('color', validators=[DataRequired()])
    weight = FloatField('weight', validators=[DataRequired()])
    dob = DateField('dob', validators=[DataRequired()])
    size = SelectField('size', choices=[
        ('a fine boi', 'A fine boi (16-26% Body Fat)'),
        ('he chomnk', 'He chomnk (26-35% Body Fat)'),
        ('a heckin chonker', 'A heckin chonker (26-45% Body Fat)'),
        ('heftychonk', 'Heftychonk (46-55% Body Fat)'),
        ('megachonker', 'Megachonker (56-65% Body Fat)'),
        ('oh lawd he comin', 'Oh lawd he comin (65% Body Fat)')
    ], validators=[DataRequired()])
    behavior = SelectField('behavior', choices=[
    ('calm', 'Calm'),
    ('playful', 'Playful'),
    ('aggressive', 'Aggressive'),
    ('shy', 'Shy')
], validators=[DataRequired()])
    medication_note = StringField('medication_note')
    dietary_note = StringField('dietary_note')
    preview_image_url = StringField('preview_image_url')
    image_urls = FieldList(StringField('image_url'), min_entries=0, max_entries=4)
    owner_id = IntegerField('owner_id', validators=[DataRequired()])