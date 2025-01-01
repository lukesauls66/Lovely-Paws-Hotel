import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserReviews } from "../../redux/review";
// import { Link } from 'react-router-dom';
import rev from "./ReviewsPage.module.css";
import { TbPaw } from "react-icons/tb";

function UserReviewList() {
  const dispatch = useDispatch();
  const {
    reviews = [],
    loading,
    errors,
  } = useSelector((state) => state.review || {});

  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    if (currentUser) {
      dispatch(getUserReviews());
    } else {
      console.error("User not logged in!");
    }
  }, [dispatch, currentUser]);

  if (loading) return <div>Loading...</div>;
  if (errors) return <div>Error: {errors}</div>;

  const pawRatingIcon = (
    <div className={rev.pawRatingIcon}>
      <TbPaw />
    </div>
  );

  return (
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
  );
}

export default UserReviewList;
