from flask_wtf import FlaskForm
from wtforms import SelectField, FloatField, FieldList, IntegerField, StringField
from wtforms.validators import DataRequired

class ServiceForm(FlaskForm):
    service = StringField('service', validators=[DataRequired()])
    price = FloatField('price', validators=[DataRequired()])
    staff = FieldList(IntegerField('User ID', validators=[DataRequired()]), min_entries=1)