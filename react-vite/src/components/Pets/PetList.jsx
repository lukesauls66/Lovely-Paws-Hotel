import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPets, fetchUserPets, fetchPetDetail } from "../../redux/pets";
import { useNavigate } from "react-router-dom";
import AddPetModal from "../PetModals/AddPetModal";
import styles from "./PetList.module.css";

const PetList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pets, status, error } = useSelector((state) => state.pets);
  const sessionUser = useSelector((state) => state.session.user);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (sessionUser.staff) {
      console.log("Fetching all pets for staff");
      dispatch(fetchAllPets());
    } else {
      console.log("Fetching user pets");
      dispatch(fetchUserPets());
    }
  }, [dispatch, sessionUser]);

  const isLoading = status === "loading";

  const handlePetClick = async (petId) => {
    try {
      console.log("Fetching pet details for petId:", petId);
      await dispatch(fetchPetDetail(petId));
      navigate(`/pets/${petId}`);
    } catch (error) {
      console.error("Failed to fetch pet details:", error);
    }
  };

  const isValidUser =
    sessionUser?.staff === true || sessionUser?.staff === false;

  return (
    <div>
      {isValidUser ? (
        <div className={styles.petListContainer}>
          <button
            onClick={() => setShowAddModal(true)}
            className={styles.addButton}
          >
            Add Pet
          </button>
          {isLoading && <div>Loading...</div>}
          {status === "failed" && <div>{error}</div>}
          {status === "succeeded" && pets.length === 0 && <div>No pets!</div>}
          {status === "succeeded" &&
            pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => handlePetClick(pet.id)}
                className={styles.petCard}
              >
                <img
                  src={pet.preview_image}
                  alt={pet.name}
                  className={styles.petImage}
                />
                <div className={styles.petName}>{pet.name}</div>
              </div>
            ))}
          {showAddModal && (
            <AddPetModal
              onClose={() => setShowAddModal(false)}
              navigate={navigate}
            />
          )}
        </div>
      ) : (
        <h1>Unauthorized</h1>
      )}
    </div>
  );
};

export default PetList;
