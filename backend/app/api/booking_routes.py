from flask import Blueprint, jsonify, request
from ..models import db, Booking, Service
from ..forms import BookingForm

booking_routes = Blueprint('bookings', __name__)

@booking_routes.route('/', methods=['GET'])
def get_booking():
  bookings = Booking.query.all()
  return {'bookings': [booking.to_dict() for booking in bookings]}


@booking_routes.route('/<int:id>', methods=['GET'])
def get_booking_one(id):
    booking = Booking.query.get(id)
    if booking is None:
      return jsonify({'message': 'Booking not found'}),
    return jsonify({'booking': booking.to_dict()})


@booking_routes.route('/', methods=['POST'])
def create_booking():
  form = BookingForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  form.services.choices = [(service.id) for service in Service.query.all()]

  if form.validate_on_submit():

    service_ids = form.services.data

    if service_ids:
      services = Service.query.filter(Service.id.in_(service_ids)).all()

    new_booking = Booking(
      client_id=form.client_id.data,
      pet_id=form.pet_id.data,
      booking_type=form.booking_type.data,
      drop_off_date=form.drop_off_date.data,
      pick_up_date=form.pick_up_date.data,
      cost=form.cost.data,
    )

    new_booking.services.extend(services)

    db.session.add(new_booking)
    db.session.commit()

    return jsonify({"message": "Booking created successfully!", "booking": new_booking.to_dict()}), 201
  
  return jsonify({"errors": form.errors}), 400


@booking_routes.route('/<int:id>', methods=['PUT'])
def update_booking(id):
  form = BookingForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  form.services.choices = [(service.id) for service in Service.query.all()]

  if form.validate_on_submit():

    service_ids = form.services.data

    if service_ids:
      services = Service.query.filter(Service.id.in_(service_ids)).all()

    booking = Booking.query.get(id)
    if not booking:
      return jsonify({"error": "Booking not found"}), 404
    
    booking.client_id = form.client_id.data
    booking.pet_id = form.pet_id.data
    booking.booking_type = form.booking_type.data
    booking.drop_off_date = form.drop_off_date.data
    booking.pick_up_date = form.pick_up_date.data
    booking.cost = form.cost.data

    for service in booking.services:
      booking.services.remove(service)

    booking.services.extend(services)

    db.session.commit()

    return jsonify({"message": "Booking updated successfully!", "booking": booking.to_dict()}), 201
  
  return jsonify({"errors": form.errors}), 400


@booking_routes.route('/<int:id>', methods=['DELETE'])
def delete_booking(id):
  booking = Booking.query.get(id)

  if not booking:
    return jsonify({"error": "Booking not found"}), 404
  
  db.session.delete(booking)
  db.session.commit()

  return jsonify({"message": "Booking deleted successfully"}), 200