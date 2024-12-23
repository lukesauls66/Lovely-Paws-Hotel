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

  useEffect(() => {
    dispatch(fetchPetDetail(petId));
  }, [dispatch, petId]);

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
    <div>
      {isValidUser ? (
        <div className={styles.petDetailContainer}>
          <h1>{pet.name}</h1>
          <>
            <button
              className={styles.updateButton}
              onClick={() => setShowEditModal(true)}
            >
              Update
            </button>
            <button className={styles.deleteButton} onClick={handleDelete}>
              Delete
            </button>
          </>
          <button
            className={styles.bookServiceButton}
            onClick={bookReservation}
          >
            Book a Reservation
          </button>
          <div className={styles.petImagesContainer}>
            <img
              src={pet.preview_image}
              alt={pet.name}
              className={styles.previewImage}
            />
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
            <p>Owner: {pet.owner.fname} {pet.owner.lname}</p>
            <p>Type: {pet.type}</p>
            <p>Breed: {pet.breed}</p>
            <p>Age: {pet.age}</p>
            <p>Gender: {pet.gender}</p>
            <p>Color: {pet.color}</p>
            <p>Weight: {pet.weight}</p>
            <p>Date of Birth: {pet.dob}</p>
            <p>Size: {pet.size}</p>
            <p>Behavior: {pet.behavior}</p>
            <p>Medication Note: {pet.medication_note}</p>
            <p>Dietary Note: {pet.dietary_note}</p>
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
