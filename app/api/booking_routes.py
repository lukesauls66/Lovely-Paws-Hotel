from flask import Blueprint, jsonify, request
from flask_wtf.csrf import validate_csrf
from flask_login import current_user
from datetime import datetime
from sqlalchemy import func
from ..models import db, Booking, Service
from ..forms import BookingForm

booking_routes = Blueprint('bookings', __name__)

@booking_routes.route('/', methods=['GET'])
def get_booking():
  try:
    bookings = Booking.query.all()
    return {'bookings': [booking.to_dict() for booking in bookings]}
  except Exception as e:
    return jsonify({'error': str(e)}), 500


@booking_routes.route('/<int:id>', methods=['GET'])
def get_booking_by_id(id):
  try:
    booking = Booking.query.filter(
      Booking.id == id,
    ).first()
    
    if booking is None:
      return jsonify({'message': 'Booking not found or has passed'}), 400
  
    return jsonify({'booking': booking.to_dict()})
  except Exception as e:
    return jsonify({'error': str(e)}), 500


@booking_routes.route('/pet/<int:id>', methods=['GET'])
def get_booking_by_pet_id(id):
  try:
    today_datetime = datetime.utcnow()
    today = today_datetime.date()

    booking = Booking.query.filter(
      Booking.pet_id == id,
      func.date(Booking.pick_up_date) >= today
      
    ).first()
    
    if booking is None:
      return jsonify({'message': 'Booking not found or has passed'}), 400
  
    return jsonify({'booking': booking.to_dict()})
  except Exception as e:
    return jsonify({'error': str(e)}), 500


@booking_routes.route('/user', methods=['GET'])
def get_booking_user():
  try:
    if not current_user.is_authenticated:
      return jsonify({"message": "User is not authenticated"}), 401
    
    bookings = Booking.query.filter(Booking.client_id == current_user.id).all()
    return jsonify({"bookings": [booking.to_dict() for booking in bookings]})
  except Exception as e:
    return jsonify({'error': str(e)}), 500


@booking_routes.route('/date/<date>', methods=['GET'])
def get_booking_by_date(date):
  try:
    # Parse the input date string into a datetime object
    target_date = datetime.strptime(date, '%Y-%m-%d').date()

    # Query bookings where the target date falls between drop_off_date and pick_up_date
    bookings = Booking.query.filter(
        Booking.drop_off_date <= target_date,
        Booking.pick_up_date >= target_date
    ).all()

    # Convert the result to a list of dictionaries
    booking_list = [booking.to_dict() for booking in bookings]

    return jsonify(booking_list), 200
  except ValueError:
    return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400
  except Exception as e:
    return jsonify({'error': str(e)}), 500


@booking_routes.route('/', methods=['POST'])
def create_booking():
  try:
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
        daily_price=form.daily_price.data,
      )

      new_booking.services.extend(services)

      db.session.add(new_booking)
      db.session.commit()

      return jsonify({"message": "Booking created successfully!", "booking": new_booking.to_dict()}), 201
    
    return jsonify({"errors": form.errors}), 400
  except Exception as e:
    return jsonify({'error': str(e)}), 500


@booking_routes.route('/<int:id>', methods=['PUT'])
def update_booking(id):
  try:
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

      for service in booking.services:
        booking.services.remove(service)

      booking.services.extend(services)

      db.session.commit()

      return jsonify({"message": "Booking updated successfully!", "booking": booking.to_dict()}), 201
    
    return jsonify({"errors": form.errors}), 400
  except Exception as e:
    return jsonify({'error': str(e)}), 500


@booking_routes.route('/<int:id>', methods=['DELETE'])
def delete_booking(id):
  try:
    csrf_token = request.cookies.get('csrf_token')  # Get CSRF token from cookies
    try:
        validate_csrf(csrf_token)  # Validate the CSRF token
    except Exception as e:
        return jsonify({"error": "CSRF token is invalid or missing"}), 400
    
    booking = Booking.query.get(id)

    if not booking:
      return jsonify({"error": "Booking not found"}), 404
    
    db.session.delete(booking)
    db.session.commit()

    return jsonify({"message": "Booking deleted successfully"}), 200
  except Exception as e:
    return jsonify({'error': str(e)}), 500