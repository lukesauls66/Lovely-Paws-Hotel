import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addPet } from '../../redux/pets';
import petStyles from './AddPetModal.module.css';

const AddPetModal = ({ onClose }) => {
  const [pet, setPet] = useState({
    name: '',
    type: 'cat',
    breed: '',
    age: '',
    gender: 'male',
    color: '',
    weight: '',
    dob: '',
    size: 'a fine boi',
    behavior: 'calm',
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
    <div className={petStyles.modal}>
      <div className={petStyles.modalContent} ref={modalRef}>
        <h2>Add Pet</h2>
        <form onSubmit={handleSubmit}>
          <input className={petStyles.petInput} name="name" value={pet.name} onChange={handleChange} placeholder="Name" required />
          <select className={petStyles.petInput} name="type" value={pet.type} onChange={handleChange} required>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
          </select>
          <input className={petStyles.petInput} name="breed" value={pet.breed} onChange={handleChange} placeholder="Breed" required />
          <input className={petStyles.petInput} name="age" value={pet.age} onChange={handleChange} placeholder="Age" required />
          <div>
            <label>
              <input type="radio" name="gender" value="male" checked={pet.gender === 'male'} onChange={handleChange} />
              Male
            </label>
            <label>
              <input type="radio" name="gender" value="female" checked={pet.gender === 'female'} onChange={handleChange} />
              Female
            </label>
          </div>
          <input className={petStyles.petInput} name="color" value={pet.color} onChange={handleChange} placeholder="Color" required />
          <input className={petStyles.petInput} name="weight" value={pet.weight} onChange={handleChange} placeholder="Weight" required />
          <input className={petStyles.petInput} name="dob" value={pet.dob} onChange={handleChange} placeholder="Date of Birth" required />
          <select className={petStyles.petInput} name="size" value={pet.size} onChange={handleChange} required>
            <option value="a fine boi">A fine boi (16-26% Body Fat)</option>
            <option value="he chomnk">He chomnk (26-35% Body Fat)</option>
            <option value="a heckin chonker">A heckin chonker (26-45% Body Fat)</option>
            <option value="heftychonk">Heftychonk (46-55% Body Fat)</option>
            <option value="megachonker">Megachonker (56-65% Body Fat)</option>
            <option value="oh lawd he comin">Oh lawd he comin (65% Body Fat)</option>
          </select>
          <select className={petStyles.petInput} name="behavior" value={pet.behavior} onChange={handleChange} required>
            <option value="calm">Calm</option>
            <option value="playful">Playful</option>
            <option value="aggressive">Aggressive</option>
            <option value="shy">Shy</option>
          </select>
          <input className={petStyles.petInput} name="medication_note" value={pet.medication_note} onChange={handleChange} placeholder="Medication Note" />
          <input className={petStyles.petInput} name="dietary_note" value={pet.dietary_note} onChange={handleChange} placeholder="Dietary Note" />
          <input className={petStyles.petInput} name="preview_image" value={pet.preview_image} onChange={handleChange} placeholder="Preview Image URL" required />
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
          <button className={petStyles.petButton} type="submit">Add Pet</button>
          <button className={petStyles.petButton} type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;