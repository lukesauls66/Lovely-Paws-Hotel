from flask import Blueprint, jsonify
from ..models import Service

service_routes = Blueprint('services', __name__)

@service_routes.route('/')
def services():
    services = Service.query.all()
    return {'services': [service.to_dict() for service in services]}

@service_routes.route('/<int:id>')
def service(id):
    service = Service.query.get(id)
    return service.to_dict()