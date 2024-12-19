import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPets } from '../../redux/pets';
import { Link } from 'react-router-dom';
import styles from './PetList.module.css';

const PetList = () => {
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets);
  const status = useSelector((state) => state.pets.status);
  const error = useSelector((state) => state.pets.error);
  const sessionUser = useSelector((state) => state.session.user);

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
            <Link to={`/${sessionUser.staff ? 'staff/pets' : 'pets'}/${pet.id}`} className={styles.managePetButton}>
              Manage Pet
            </Link>
          </div>
        ))}
    </div>
  );
};

export default PetList;