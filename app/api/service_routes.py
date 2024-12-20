from flask import Blueprint, jsonify, request
from flask_wtf.csrf import validate_csrf
from ..models import Service, User, db
from app.forms import ServiceForm

service_routes = Blueprint('services', __name__)

@service_routes.route('/')
def services():
    services = Service.query.all()
    return {'services': [service.to_dict() for service in services]}

@service_routes.route('/', methods=['POST'])
def create_service():
    form = ServiceForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    form.staff.choices = [(user.id) for user in User.query.all()]

    if form.validate_on_submit():
        staff_ids = form.staff.data
        if staff_ids:
            staff = User.query.filter(User.id.in_(staff_ids)).all()

        new_service = Service(
            service=form.data['service'],
            price=form.data['price'],
        )

        new_service.staff.extend(staff)

        db.session.add(new_service)
        db.session.commit()
        return jsonify({"Service": new_service.to_dict()}), 201
    return jsonify({"errors": form.errors}), 400

@service_routes.route('/<int:id>')
def service(id):
    service = Service.query.get(id)
    return service.to_dict()

@service_routes.route('/<int:id>', methods=['PUT'])
def update_service(id):
    form = ServiceForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    form.staff.choices = [(user.id) for user in User.query.all()]

    if form.validate_on_submit():
        staff_ids = form.staff.data

        if staff_ids:
            staffs = User.query.filter(User.id.in_(staff_ids)).all()

        service = Service.query.get(id)
        if not service:
            return jsonify({"error": "Service not found"})
        
        service.service = form.service.data
        service.price = form.price.data
        service.staff = []

        service.staff.extend(staffs)

        db.session.commit()
        return jsonify({"service": service.to_dict()})
    return jsonify({"errors": form.errors})


@service_routes.route('/<int:id>', methods=['DELETE'])
def delete_service(id):
    csrf_token = request.cookies.get('csrf_token')  # Get CSRF token from cookies

    try:
        validate_csrf(csrf_token)  # Validate the CSRF token
    except Exception as e:
        return jsonify({"error": "CSRF token is invalid or missing"}), 400
    
    service = Service.query.get(id)

    if not service:
        return jsonify({"error": "Service not found"})
    
    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Service was deleted"})
