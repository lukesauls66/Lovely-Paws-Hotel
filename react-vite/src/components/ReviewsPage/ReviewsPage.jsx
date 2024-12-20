import rev from "./ReviewsPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import * as reviewActions from "../../redux/review";
import { TbPaw } from "react-icons/tb";

function ReviewsPage() {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [pawsRating, setPawsRating] = useState(0);
  const { reviews = [], loading, errors } = useSelector((state) => state.review || {});
  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(reviewActions.getAllReviews());
  }, [dispatch]);

  const handleCreateReview = async (event) => {
    event.preventDefault();

    if (!reviewText || pawsRating === 0) {
      alert("Please enter both a review and a paws rating.");
      return;
    }

    const newReview = {
      review: reviewText,
      paws: pawsRating,
      client_id: currentUser.id,
    };

    await dispatch(reviewActions.createNewReview(newReview));
    dispatch(reviewActions.getAllReviews());
    setReviewText("");
    setPawsRating(0);
    setIsFormOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (errors) return <div>Error: {errors}</div>;

  const pawRatingIcon = <div className={rev.pawRatingIcon}><TbPaw /></div>;

  return (
    <div className={rev.reviewsMainContainer}>
      <div className={rev.reviewsHeader}>
        <h1 className={rev.h1}>Lovely Paws Reviews</h1>
        <h3 className={rev.h3}>Tell us about your pet&apos;s stay!</h3>
        <button 
          className={rev.addReviewBtn}
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? "Close Review Form" : "Add a Review"}
        </button>
      </div>
      <br />

      {isFormOpen && (
        <form onSubmit={handleCreateReview} className={rev.reviewForm}>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            required
            rows="5"
            className={rev.textarea}
          />
          <div className={rev.rating}>
            <label>Paws Rating:</label>
            <select
              value={pawsRating}
              onChange={(e) => setPawsRating(Number(e.target.value))}
              className={rev.select}
            >
              <option value={0}>Select rating</option>
              <option value={1}>1 Paw</option>
              <option value={2}>2 Paws</option>
              <option value={3}>3 Paws</option>
              <option value={4}>4 Paws</option>
              <option value={5}>5 Paws</option>
            </select>
          </div>
          <button type="submit" className={rev.submitBtn}>Submit Review</button>
        </form>
      )}

      <div className={rev.allReviewsContainer}>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className={rev.reviewContainer}>
              <div className={rev.username}>{review.client_username}</div>
              <div className={rev.review}>{review.review}</div>
              <div className={rev.paws}>
                {pawRatingIcon}
                {review.paws}
              </div>
            </div>
          ))
        ) : (
          <div>No reviews available</div>
        )}
      </div>
    </div>
  );
}

export default ReviewsPage;
