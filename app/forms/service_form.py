from flask_wtf import FlaskForm
from wtforms import FloatField, IntegerField, StringField, SelectMultipleField
from wtforms.validators import DataRequired

class ServiceForm(FlaskForm):
    service = StringField('service', validators=[DataRequired()])
    price = FloatField('price', validators=[DataRequired()])
    staff = SelectMultipleField('User Id', choices=[], coerce=int, validators=[DataRequired()])