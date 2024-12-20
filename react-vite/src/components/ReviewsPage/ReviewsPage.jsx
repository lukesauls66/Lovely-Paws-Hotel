import rev from "./ReviewsPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as reviewActions from "../../redux/review"

function ReviewsPage() {
  const dispatch = useDispatch();
  const { reviews = [], loading, errors } = useSelector((state) => state.review || {});

  // const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(reviewActions.getAllReviews());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (errors) return <div>Error: {errors}</div>;

  // const isOwnerOrManager = currentUser?.position === "Manager" || currentUser?.position === "Owner";


  return (
    <div className={rev.reviewsMainContainer}>
        <div className={rev.allReviewsContainer}>
            {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className={rev.reviewContainer}>
                      <div>{review.review}</div>
                      <div>{review.paws}</div> {/* Update `stars` to `paws` */}
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