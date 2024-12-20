import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPets, fetchUserPets, fetchPetDetail } from '../../redux/pets';
import { useNavigate } from 'react-router-dom';
import AddPetModal from '../PetModals/AddPetModal';
import styles from './PetList.module.css';

const PetList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pets = useSelector((state) => state.pets.pets);
  const status = useSelector((state) => state.pets.status);
  const error = useSelector((state) => state.pets.error);
  const sessionUser = useSelector((state) => state.session.user);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      if (sessionUser.staff) {
        dispatch(fetchAllPets());
      } else {
        dispatch(fetchUserPets());
      }
    }
  }, [status, dispatch, sessionUser]);

  const handlePetClick = async(petId) => {
    await dispatch(fetchPetDetail(petId));
    navigate(`/pets/${petId}`);
  };

  return (
    <div className={styles.petListContainer}>
      {sessionUser.staff && (
        <button onClick={() => setShowAddModal(true)} className={styles.addButton}>
          Add Pet
        </button>
      )}
      {status === 'loading' && <div>Loading...</div>}
      {status === 'failed' && <div>{error}</div>}
      {status === 'succeeded' &&
        pets.map((pet) => (
          <div
            key={pet.id}
            onClick={() => handlePetClick(pet.id)}
            className={styles.petCard}
          >
            <img src={pet.preview_image} alt={pet.name} className={styles.petImage} />
            <div className={styles.petName}>{pet.name}</div>
          </div>
        ))}
      {showAddModal && <AddPetModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default PetList;