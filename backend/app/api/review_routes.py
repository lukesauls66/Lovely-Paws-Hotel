from flask import Blueprint, jsonify, request
from ..models import Review, db
from ..forms import ReviewForm


review_routes = Blueprint('reviews', __name__)


@review_routes.route('/')
def reviews():
    reviews = Review.query.all()
    return {'reviews': [review.to_dict() for review in reviews]}


@review_routes.route('/', methods=['POST'])
def post_review():
    form = ReviewForm()
    form_data = request.get_json()

    form['csrf_token'].data = request.cookies.get('csrf_token')
    form.process(data=form_data)

    if form.validate_on_submit():
        new_review = Review(
            review=form.review.data,
            stars=form.stars.data
        )

        db.session.add(new_review)
        db.session.commit()
        return jsonify(new_review.to_dict()), 201

    return {'errors': form.errors}, 400


@review_routes.route('/<int:review_id>', methods=['GET'])
def get_review_by_id(review_id):
    review = Review.query.get(review_id)

    if review:
        return jsonify(review.to_dict()), 200
    else:
        return {'error': f'Review with ID {review_id} not found'}, 404
    
