import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePet } from '../../redux/pets';
import styles from './EditPetModal.module.css'; 

const EditPetModal = ({ petId, onClose }) => {
  const dispatch = useDispatch();
  const pet = useSelector((state) => state.pets.pets.find((p) => p.id === petId));

  const [updatedPet, setUpdatedPet] = useState(pet);
  const [imageUrls, setImageUrls] = useState(pet.pet_images.map((img) => img.url));

  useEffect(() => {
    setUpdatedPet(pet);
    setImageUrls(pet.pet_images.map((img) => img.url));
  }, [pet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPet({ ...updatedPet, [name]: value });
  };

  const handleImageChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const handleAddImageField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePet({ id: petId, pet: { ...updatedPet, image_urls: imageUrls } }));
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Edit Pet</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" value={updatedPet.name} onChange={handleChange} placeholder="Name" required />
          <input name="type" value={updatedPet.type} onChange={handleChange} placeholder="Type" required />
          <input name="breed" value={updatedPet.breed} onChange={handleChange} placeholder="Breed" required />
          <input name="age" value={updatedPet.age} onChange={handleChange} placeholder="Age" required />
          <input name="gender" value={updatedPet.gender} onChange={handleChange} placeholder="Gender" required />
          <input name="color" value={updatedPet.color} onChange={handleChange} placeholder="Color" required />
          <input name="weight" value={updatedPet.weight} onChange={handleChange} placeholder="Weight" required />
          <input name="dob" value={updatedPet.dob} onChange={handleChange} placeholder="Date of Birth" required />
          <input name="size" value={updatedPet.size} onChange={handleChange} placeholder="Size" required />
          <input name="behavior" value={updatedPet.behavior} onChange={handleChange} placeholder="Behavior" required />
          <input name="medication_note" value={updatedPet.medication_note} onChange={handleChange} placeholder="Medication Note" required />
          <input name="dietary_note" value={updatedPet.dietary_note} onChange={handleChange} placeholder="Dietary Note" required />
          <input name="preview_image" value={updatedPet.preview_image} onChange={handleChange} placeholder="Preview Image URL" required />
          {imageUrls.map((url, index) => (
            <input
              key={index}
              value={url}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder="Additional Image URL"
            />
          ))}
          <button type="button" onClick={handleAddImageField}>Add Image</button>
          <button type="submit">Update Pet</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditPetModal;