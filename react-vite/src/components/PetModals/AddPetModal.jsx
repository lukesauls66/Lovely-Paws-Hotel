import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addPet } from '../../redux/pets';
import styles from './AddPetModal.module.css';

const AddPetModal = ({ onClose }) => {
  const [pet, setPet] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    color: '',
    weight: '',
    dob: '',
    size: '',
    behavior: '',
    medication_note: '',
    dietary_note: '',
    preview_image: '',
    pet_images: [],
  });

  const [imageUrls, setImageUrls] = useState(['']);
  const modalRef = useRef(null);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet({ ...pet, [name]: value });
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
    dispatch(addPet({ ...pet, image_urls: imageUrls }));
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent} ref={modalRef}>
        <h2>Add Pet</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" value={pet.name} onChange={handleChange} placeholder="Name" required />
          <input name="type" value={pet.type} onChange={handleChange} placeholder="Type" required />
          <input name="breed" value={pet.breed} onChange={handleChange} placeholder="Breed" required />
          <input name="age" value={pet.age} onChange={handleChange} placeholder="Age" required />
          <input name="gender" value={pet.gender} onChange={handleChange} placeholder="Gender" required />
          <input name="color" value={pet.color} onChange={handleChange} placeholder="Color" required />
          <input name="weight" value={pet.weight} onChange={handleChange} placeholder="Weight" required />
          <input name="dob" value={pet.dob} onChange={handleChange} placeholder="Date of Birth" required />
          <input name="size" value={pet.size} onChange={handleChange} placeholder="Size" required />
          <input name="behavior" value={pet.behavior} onChange={handleChange} placeholder="Behavior" required />
          <input name="medication_note" value={pet.medication_note} onChange={handleChange} placeholder="Medication Note" required />
          <input name="dietary_note" value={pet.dietary_note} onChange={handleChange} placeholder="Dietary Note" required />
          <input name="preview_image" value={pet.preview_image} onChange={handleChange} placeholder="Preview Image URL" required />
          {imageUrls.map((url, index) => (
            <input
              key={index}
              value={url}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder="Additional Image URL"
            />
          ))}
          <button type="button" onClick={handleAddImageField}>Add Image</button>
          <button type="submit">Add Pet</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;