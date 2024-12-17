from flask import Blueprint, jsonify, request
from flask_wtf.csrf import validate_csrf
from ..models import Review, db
from ..forms import ReviewForm
from flask_login import current_user


review_routes = Blueprint('reviews', __name__)


@review_routes.route('/')
def reviews():
    reviews = Review.query.all()
    return {'reviews': [review.to_dict() for review in reviews]}


@review_routes.route('/', methods=['POST'])
def post_review():
    form = ReviewForm()

    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_review = Review(
            client_id=current_user.id,
            review=form.review.data,
            paws=form.paws.data
        )

        db.session.add(new_review)
        db.session.commit()
        return jsonify(new_review.to_dict()), 201

    return {'errors': form.errors}, 400


@review_routes.route('/<int:review_id>')
def get_review_by_id(review_id):
    review = Review.query.get(review_id)

    if review:
        return jsonify(review.to_dict()), 200
    else:
        return {'error': f'Review with ID {review_id} not found'}, 404
    

@review_routes.route('/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    review = Review.query.get(review_id)

    if not review:
        return {'error': f'Review with ID {review_id} not found'}, 404

    if review.client_id != current_user.id:
        return {'error': 'You can only update your own review'}, 403
    
    form = ReviewForm()

    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        review.review = form.review.data
        review.paws = form.paws.data

        db.session.commit()

        return jsonify(review.to_dict()), 200
    
    return {'errors': form.errors}, 400


@review_routes.route('/<int:review_id>', methods=['DELETE'])
def remove_review(review_id):
    csrf_token = request.cookies.get('csrf_token')  # Get CSRF token from cookies

    try:
        validate_csrf(csrf_token)  # Validate the CSRF token
    except Exception as e:
        return jsonify({"error": "CSRF token is invalid or missing"}), 400
    review = Review.query.get(review_id)

    if not review:
        return {'error': f'Review with ID {review_id} not found'}, 404

    if review.client_id != current_user.id:
        return {'error': 'You can only delete your own review'}, 403

    db.session.delete(review)
    db.session.commit()

    return {'message': 'Review deleted successfully'}, 200


@review_routes.route('/user')
def current_user_reviews():
    reviews = Review.query.filter(Review.client_id == current_user.id).all()

    if reviews:
        return jsonify([review.to_dict() for review in reviews]), 200
    else:
        return {'error': f'No reviews found for User {current_user.id}.'}, 404
    
    