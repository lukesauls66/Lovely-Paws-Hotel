import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePet } from '../../redux/pets';
import petStyles from './EditPetModal.module.css'; 

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
    <div className={petStyles.modal}>
      <div className={petStyles.modalContent}>
        <h2>Edit Pet</h2>
        <form onSubmit={handleSubmit}>
          <input className={petStyles.petInput} name="name" value={updatedPet.name} onChange={handleChange} placeholder="Name" required />
          <input className={petStyles.petInput} name="type" value={updatedPet.type} onChange={handleChange} placeholder="Type" required />
          <input className={petStyles.petInput} name="breed" value={updatedPet.breed} onChange={handleChange} placeholder="Breed" required />
          <input className={petStyles.petInput} name="age" value={updatedPet.age} onChange={handleChange} placeholder="Age" required />
          <input className={petStyles.petInput} name="gender" value={updatedPet.gender} onChange={handleChange} placeholder="Gender" required />
          <input className={petStyles.petInput} name="color" value={updatedPet.color} onChange={handleChange} placeholder="Color" required />
          <input className={petStyles.petInput} name="weight" value={updatedPet.weight} onChange={handleChange} placeholder="Weight" required />
          <input className={petStyles.petInput} name="dob" value={updatedPet.dob} onChange={handleChange} placeholder="Date of Birth" required />
          <input className={petStyles.petInput} name="size" value={updatedPet.size} onChange={handleChange} placeholder="Size" required />
          <input className={petStyles.petInput} name="behavior" value={updatedPet.behavior} onChange={handleChange} placeholder="Behavior" required />
          <input className={petStyles.petInput} name="medication_note" value={updatedPet.medication_note} onChange={handleChange} placeholder="Medication Note" required />
          <input className={petStyles.petInput} name="dietary_note" value={updatedPet.dietary_note} onChange={handleChange} placeholder="Dietary Note" required />
          <input className={petStyles.petInput} name="preview_image" value={updatedPet.preview_image} onChange={handleChange} placeholder="Preview Image URL" required />
          {imageUrls.map((url, index) => (
            <input
              key={index}
              className={petStyles.petInput}
              value={url}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder="Additional Image URL"
            />
          ))}
          <button className={petStyles.petButton} type="button" onClick={handleAddImageField}>Add Image</button>
          <button className={petStyles.petButton} type="submit">Update Pet</button>
          <button className={petStyles.petButton} type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditPetModal;