from flask import Blueprint, jsonify
from ..models import db, Booking, Service
from ..forms import BookingForm

booking_routes = Blueprint('bookings', __name__)

@booking_routes.route('/')
def get_booking():
  bookings = Booking.query.all()
  return {'bookings': [booking.to_dict() for booking in bookings]}


@booking_routes.route('/', methods=['POST'])
def create_booking():
  form = BookingForm()
  if form.validate_on_submit():
    new_booking = Booking(
      client_id=form.client_id.data,
      pet_id=form.pet_id.data,
      booking_type=form.booking_type.data,
      drop_off_date=form.drop_off_date.data,
      pick_up_date=form.pick_up_date.data,
      cost=form.cost.data,
    )

    service_ids=form.services.data
    services=Service.query.filter(Service.id.in_(service_ids)).all()

    new_booking.services.extend(services)

    db.session.add(new_booking)
    db.session.commit()

    return jsonify({"message": "Booking created successfully!", "booking": new_booking.to_dict()}), 201
  
  return jsonify({"errors": form.errors}), 400

