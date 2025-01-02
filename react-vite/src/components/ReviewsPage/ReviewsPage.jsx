import rev from "./ReviewsPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import * as reviewActions from "../../redux/review";
// import { TbPaw } from "react-icons/tb";
import { IoIosPaw } from "react-icons/io";

function ReviewsPage() {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [pawsRating, setPawsRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPaws, setEditPaws] = useState(0);
  const {
    reviews = [],
    loading,
    errors,
  } = useSelector((state) => state.review || {});
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

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setEditText(review.review);
    setEditPaws(review.paws);
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    const updatedReview = {
      review: editText,
      paws: editPaws,
    };

    await dispatch(
      reviewActions.updateReview({ id: editingReviewId, review: updatedReview })
    );
    dispatch(reviewActions.getAllReviews());
    setEditingReviewId(null);
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(reviewActions.deleteReview(reviewId));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (errors) return <div>Error: {errors}</div>;

  const pawRatingIcon = (
    <div className={rev.pawRatingIcon}>
      <IoIosPaw />
    </div>
  );

  const isNotStaff = currentUser?.staff === false;

  return (
    <div className={rev.reviewsMainContainer}>
      <div className={rev.reviewsHeader}>
        <h1 className={rev.h1}>Lovely Paws Reviews</h1>
      </div>
      <div className={rev.allReviewsContainer}>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className={rev.reviewContainer}>
              {editingReviewId === review.id ? (
                <form onSubmit={handleSaveEdit} className={rev.editForm}>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows="3"
                    className={rev.textarea}
                  />
                  <div className={rev.rating}>
                    <label className={rev.editLabel}>Paws Rating:</label>
                    <div className={rev.editPawIcons}>
                      {[1, 2, 3, 4, 5].map((paw) => (
                        <IoIosPaw
                          key={paw}
                          size={35}
                          onClick={() => setEditPaws(paw)} 
                          onMouseEnter={() => setHoverRating(paw)} 
                          onMouseLeave={() => setHoverRating(0)}
                          style={{
                            color:
                              paw <= (hoverRating || editPaws) ? "#fa8d83" : "gray", 
                            cursor: "pointer",
                            margin: "0 5px",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className={rev.editSaveBtns}>
                    <button type="submit" className={rev.editSaveBtn}>
                      Save
                    </button>
                    <button
                      type="button"
                      className={rev.cancelEditBtn}
                      onClick={() => setEditingReviewId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className={rev.reviewCard}>
                  <div className={rev.reviewHeading}>
                    <div className={rev.paws}>
                      {pawRatingIcon}
                      {review.paws}
                    </div>
                    <div className={rev.username}>{review.client_username}</div>
                  </div>
                  <div className={rev.review}>{review.review}</div>
                  <div className={rev.reviewBtnContainer}>
                    {currentUser?.id === review.client_id && (
                      <button
                        className={rev.editBtn}
                        onClick={() => handleEditReview(review)}
                      >
                        Edit
                      </button>
                    )}
                    {(currentUser?.id === review.client_id ||
                      ["Owner", "Manager"].includes(currentUser?.position)) && (
                      <button
                        className={rev.deleteBtn}
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div>No reviews available</div>
        )}
      </div>
      {currentUser && isNotStaff && (
        <>
          <h3 className={rev.h3}>Tell us about your pet&apos;s stay!</h3>
          <button
            className={rev.addReviewBtn}
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            {isFormOpen ? "Cancel" : "Add a Review"}
          </button>
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
                <div className={rev.pawIcons}>
                  {[1, 2, 3, 4, 5].map((paw) => (
                    <IoIosPaw
                      key={paw}
                      size={30}
                      onClick={() => setPawsRating(paw)}
                      onMouseEnter={() => setHoverRating(paw)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        color:
                          paw <= (hoverRating || pawsRating)
                            ? "#f7a59e"
                            : "gray",
                        cursor: "pointer",
                        margin: "0 5px",
                      }}
                    />
                  ))}
                </div>
              </div>
              <button type="submit" className={rev.submitBtn}>
                Submit Review
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewsPage;
