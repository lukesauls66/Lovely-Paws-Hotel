import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPets, fetchUserPets } from '../../redux/pets';
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
      if (sessionUser.staff) {
        dispatch(fetchAllPets());
      } else {
        dispatch(fetchUserPets());
      }
    }
  }, [status, dispatch, sessionUser]);

  return (
    <div className={styles.petListContainer}>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'failed' && <div>{error}</div>}
      {status === 'succeeded' &&
        pets.map((pet) => (
          <Link
            key={pet.id}
            to={`/${sessionUser.staff ? 'staff/pets' : 'pets'}/${pet.id}`}
            className={styles.petCard}
          >
            <img src={pet.preview_image} alt={pet.name} className={styles.petImage} />
            <div className={styles.petName}>{pet.name}</div>
          </Link>
        ))}
    </div>
  );
};

export default PetList;