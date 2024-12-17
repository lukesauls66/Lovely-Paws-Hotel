from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, DateTimeField, FieldList
from wtforms.validators import DataRequired, ValidationError
from app.models import Service

class BookingForm(FlaskForm):
  client_id = IntegerField('client_id', validators=[DataRequired])
  pet_id = IntegerField('pet_id', validators=[DataRequired])
  booking_type = StringField('booking type', validators=[DataRequired])
  drop_off_date = DateTimeField('drop off date and time', validators=[DataRequired])
  pick_up_date = DateTimeField('pick up date and time', validators=[DataRequired])
  cost = IntegerField('cost')

  services = FieldList(IntegerField('Service ID', validators=[DataRequired], min_entries=1))
