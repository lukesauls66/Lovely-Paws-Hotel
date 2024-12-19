import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPets } from '../../redux/pets/pets';
import { Link } from 'react-router-dom';
import styles from '../../styles/UserPetList.module.css';

const UserPetList = () => {
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets);
  const status = useSelector((state) => state.pets.status);
  const error = useSelector((state) => state.pets.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPets());
    }
  }, [status, dispatch]);

  return (
    <div className={styles.petListContainer}>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'failed' && <div>{error}</div>}
      {status === 'succeeded' &&
        pets.map((pet) => (
          <div key={pet.id} className={styles.petCard}>
            <img src={pet.preview_image} alt={pet.name} className={styles.petImage} />
            <div className={styles.petName}>{pet.name}</div>
            <Link to={`/pets/${pet.id}`} className={styles.managePetButton}>
              Manage Pet
            </Link>
          </div>
        ))}
    </div>
  );
};

export default UserPetList;