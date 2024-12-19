import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { deletePet } from '../../redux/pets';
import styles from './UserPetDetail.module.css';

const UserPetDetail = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pet = useSelector((state) => state.pets.pets.find((p) => p.id === parseInt(petId)));

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      dispatch(deletePet(pet.id));
      navigate('/pets');
    }
  };

  return (
    <div className={styles.petDetailContainer}>
      <h1>{pet.name}</h1>
      <button className={styles.updateButton}>Update</button>
      <button className={styles.deleteButton} onClick={handleDelete}>
        Delete
      </button>
      <button className={styles.bookServiceButton}>Book a Service</button>
      <div className={styles.petImagesContainer}>
        <img src={pet.preview_image} alt={pet.name} className={styles.previewImage} />
        <div className={styles.additionalImages}>
          {pet.pet_images.map((image) => (
            <img key={image.id} src={image.url} alt="Pet" className={styles.petImage} />
          ))}
        </div>
      </div>
      <div className={styles.petDetails}>
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
    </div>
  );
};

export default UserPetDetail;