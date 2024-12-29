import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as sessionActions from "../../redux/session";
import ProfileButton from "../Navigation/ProfileButton";
import lan from "./LandingPage.module.css";
import DemoButton from "../Navigation/DemoButton";

function LandingPage() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className={lan.landingPageContainer}>
      <div className={lan.bannerContainer}>
        <img className={lan.logo} src="/images/logo-banner.jpg" alt="logo" />
        {currentUser &&
          (currentUser.position === "Owner" ||
            currentUser.position === "Manager") && (
            <div className={lan.adminButtonContainer}>
              <button className={lan.adminButton} onClick={toggleDropdown}>
                Admin
              </button>
              {isDropdownOpen && (
                <div className={lan.adminMenu}>
                  <button
                    onClick={() => navigate("/services")}
                    className={lan.manageServicesBtn}
                  >
                    Manage Services
                  </button>
                  <button
                    onClick={() => navigate("/users")}
                    className={lan.manageUsersBtn}
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={() => navigate("/bookings")}
                    className={lan.manageBookingsBtn}
                  >
                        Manage Bookings
                  </button>
                </div>
              )}
            </div>
          )}
        <div className={lan.profileButton}>
          <ProfileButton />
        </div>
        <div className={lan.demoButton}>
          <DemoButton /> {/* Add DemoButton */}
        </div>
      </div>
      <div className={lan.landingBodyContainer}>
        <div className={lan.messageContainer}>
          <img className={lan.pawLeft} src="/images/paw-left.png" alt="paw" />
          <h1 className={lan.messageBox}>
            YOUR PET&apos;S ULTIMATE VACATION AWAITS!
          </h1>
          <img className={lan.pawRight} src="/images/paw-right.png" alt="paw" />
        </div>
        <div className={lan.infoContainer}>
          <div className={lan.aboutContainer}>
            <div className={lan.aboutBox}>
              <h1>Welcome to Paradise!</h1>
              <p className={lan.aboutParagraph}>
                At Lovely Paws Hotel, we&apos;re dedicated to making every stay
                a paws-itively delightful experience for your furry family
                members. Our cozy, pet-friendly haven is designed to feel like a
                home away from home, filled with love, comfort, and plenty of
                tail-wagging fun. From pampering spa treatments to playtime
                galore, we go the extra mile to ensure your pets enjoy the
                ultimate care and relaxation.
              </p>
              <p className={lan.aboutParagraph}>
                Our team of passionate animal lovers is committed to treating
                each guest like family. We understand how much your pets mean to
                you, and we&apos;re here to provide them with a safe, nurturing
                environment where they can thrive while you&apos;re away. At
                Lovely Paws Hotel, love and happiness are always at the heart of
                everything we do!
              </p>
            </div>

            <div className={lan.petOfMonthBox}>
              <h1 className={lan.petOfMonthHeader}>Pet of the Month</h1>
              <img
                className={lan.petOfMonthImage}
                src="/images/king.jpg"
                alt="king"
              />
            </div>
          </div>
          <div className={lan.featuresBox}>
            <button
              className={lan.servicesBtn}
              onClick={() => navigate("/services")}
            >
              Browse Our Services
            </button>
            <img className={lan.catPic} src="/images/cat.png" alt="cat" />
            <img className={lan.dogPic} src="/images/dog.png" alt="dog" />
            <button
              className={lan.bookingsBtn}
              onClick={() => navigate("/pets")}
            >
              Book a Reservation
            </button>
            <div className={lan.reviewsContainer}>
              <h1>Top Reviews</h1>
              <button
                className={lan.reviewsBtn}
                onClick={() => navigate("/reviews")}
              >
                See All Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
