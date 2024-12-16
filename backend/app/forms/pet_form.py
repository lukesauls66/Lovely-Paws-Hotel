# forms/pet_form.py

from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField, DateField
from wtforms.validators import DataRequired

class PetForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    type = StringField('type', validators=[DataRequired()])
    breed = StringField('breed', validators=[DataRequired()])
    age = IntegerField('age', validators=[DataRequired()])
    gender = StringField('gender', validators=[DataRequired()])
    color = StringField('color', validators=[DataRequired()])
    weight = FloatField('weight', validators=[DataRequired()])
    dob = DateField('dob', validators=[DataRequired()])
    size = StringField('size', validators=[DataRequired()])
    behavior = StringField('behavior', validators=[DataRequired()])
    medication_note = StringField('medication_note')
    dietary_note = StringField('dietary_note')
    preview_image = StringField('preview_image', validators=[DataRequired()])
    image_url = StringField('image_url', validators=[DataRequired()])