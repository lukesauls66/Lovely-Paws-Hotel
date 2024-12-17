from flask import Blueprint, jsonify, request
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
            stars=form.stars.data
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
    
@review_routes.route('/current-user')
def current_user_reviews():
    reviews = Review.query.filter(Review.client_id == current_user.id).all()

    if reviews:
        return jsonify([review.to_dict() for review in reviews]), 200
    else:
        return {'error': f'No reviews found for User {current_user.id}.'}, 404