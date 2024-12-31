import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPetDetail, deletePet } from "../../redux/pets";
import EditPetModal from "../PetModals/EditPetModal";
import styles from "./PetDetail.module.css";

const PetDetail = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pet = useSelector((state) => state.pets.selectedPet);
  const status = useSelector((state) => state.pets.status);
  const sessionUser = useSelector((state) => state.session.user);
  const [showEditModal, setShowEditModal] = useState(false);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    dispatch(fetchPetDetail(petId));
  }, [dispatch, petId]);

  useEffect(() => {
    if (pet) {
      fetchOwner(pet.owner_id);
    }
  }, [pet]);

  const fetchOwner = async (ownerId) => {
    try {
      const response = await fetch(`/api/users/${ownerId}`);
      const data = await response.json();
      setOwner(data);
    } catch (error) {
      console.error("Failed to fetch owner details:", error);
    }
  };

  useEffect(() => {
    if (!showEditModal) {
      dispatch(fetchPetDetail(petId));
    }
  }, [showEditModal, dispatch, petId]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      dispatch(deletePet(pet.id));
      navigate("/pets");
    }
  };

  const bookReservation = () => {
    navigate(`/bookings/pet/${pet.id}`);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!pet) {
    return <div>Pet not found</div>;
  }

  const isValidUser =
    sessionUser?.staff === true || sessionUser?.id === pet.owner_id;

  return (
    <div className={styles.mainPetDetailsPage}>
      {isValidUser ? (
        <div className={styles.petDetailContainer}>
          <h1 className={styles.petName}>{pet.name}</h1>
          <div className={styles.optionsButtons}>
            <button
              className={styles.updateButton}
              onClick={() => setShowEditModal(true)}
            >
              Update
            </button>
            <button className={styles.deleteButton} onClick={handleDelete}>
              Delete
            </button>
          </div>
          <button
            className={styles.bookServiceButton}
            onClick={bookReservation}
          >
            Book a Reservation
          </button>
          <div className={styles.previewImgContainer}>
            <img
              src="/images/paw-trail.png"
              alt="paw trail"
              className={styles.pawTrailPic}
            />
            <div className={styles.previewImgBox}>
              <img
                src={pet.preview_image}
                alt={pet.name}
                className={styles.previewImage}
              />
            </div>
            <img
              src="/images/paw-trail.png"
              alt="paw trail"
              className={styles.pawTrailPic}
            />
          </div>
          <div className={styles.petImagesContainer}>
            <div className={styles.additionalImages}>
              {pet.pet_images.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt="Pet"
                  className={styles.petImage}
                />
              ))}
            </div>
          </div>
          <div className={styles.petDetails}>
            {owner && (
              <p>
                <span className={styles.detailTitle}>Owner:</span>
                {owner.fname} {owner.lname}
              </p>
            )}
            <p>
              <span className={styles.detailTitle}>Type:</span> {pet.type}
            </p>
            <p>
              <span className={styles.detailTitle}>Breed:</span> {pet.breed}
            </p>
            <p>
              <span className={styles.detailTitle}>Age:</span> {pet.age}
            </p>
            <p>
              <span className={styles.detailTitle}>Gender:</span> {pet.gender}
            </p>
            <p>
              <span className={styles.detailTitle}>Color:</span> {pet.color}
            </p>
            <p>
              <span className={styles.detailTitle}>Weight:</span> {pet.weight}
              lbs
            </p>
            <p>
              <span className={styles.detailTitle}>Birthday:</span> {pet.dob}
            </p>
            <p>
              <span className={styles.detailTitle}>Size:</span> {pet.size}
            </p>
            <p>
              <span className={styles.detailTitle}>Behavior:</span>{" "}
              {pet.behavior}
            </p>
            <p>
              <span className={styles.detailTitle}>Medication Note:</span>{" "}
              {pet.medication_note}
            </p>
            <p>
              <span className={styles.detailTitle}>Dietary Note:</span>{" "}
              {pet.dietary_note}
            </p>
          </div>
          {showEditModal && (
            <EditPetModal
              petId={pet.id}
              onClose={() => setShowEditModal(false)}
            />
          )}
        </div>
      ) : (
        <h1>Unauthorized</h1>
      )}
    </div>
  );
};

export default PetDetail;
