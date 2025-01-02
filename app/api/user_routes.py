from flask import Blueprint, jsonify
from flask_login import login_required
from sqlalchemy import not_, and_, or_
from ..models import User

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/real')
@login_required
def real_users():
    excluded_usernames = ["demo-employee", "demo-client", "demo-manager", "demo-owner"]
    users = User.query.filter(and_(not_(User.username.in_(excluded_usernames))), or_(User.position.is_(None), User.position != "Owner")).order_by(User.position).all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/staff')
@login_required
def staff():
    staff = User.query.filter(User.position == "Employee", User.username != "demo-employee").all()
    return {'staff': [staff_member.to_dict() for staff_member in staff]}
