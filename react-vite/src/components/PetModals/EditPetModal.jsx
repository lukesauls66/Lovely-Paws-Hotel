import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePet, fetchPetDetail } from '../../redux/pets';
import petStyles from './EditPetModal.module.css'; 

const EditPetModal = ({ petId, onClose }) => {
  const dispatch = useDispatch();
  const pet = useSelector((state) => state.pets.pets.find((p) => p.id === petId));
  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    if (!pet) {
      dispatch(fetchPetDetail(petId));
    }
  }, [dispatch, pet, petId]);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [updatedPet, setUpdatedPet] = useState({
    name: pet?.name || '',
    type: pet?.type || '',
    breed: pet?.breed || '',
    age: pet?.age || '',
    gender: pet?.gender || '',
    color: pet?.color || '',
    weight: pet?.weight || '',
    dob: formatDate(pet?.dob) || '',
    size: pet?.size || '',
    behavior: pet?.behavior || '',
    medication_note: pet?.medication_note || '',
    dietary_note: pet?.dietary_note || '',
    preview_image: pet?.preview_image || '',
  });
  const [imageUrls, setImageUrls] = useState(pet?.pet_images.map((img) => img.url) || []);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (pet) {
      setUpdatedPet({
        name: pet.name || '',
        type: pet.type || '',
        breed: pet.breed || '',
        age: pet.age || '',
        gender: pet.gender || '',
        color: pet.color || '',
        weight: pet.weight || '',
        dob: formatDate(pet.dob) || '',
        size: pet.size || '',
        behavior: pet.behavior || '',
        medication_note: pet.medication_note || '',
        dietary_note: pet.dietary_note || '',
        preview_image: pet.preview_image || '',
      });
      setImageUrls(pet.pet_images.map((img) => img.url) || []);
    }
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

  const validatePetData = (data) => {
    const errors = {};
    if (!data.name || data.name.trim() === "") {
      errors.name = "Pet name is required";
    }
    if (!data.type) {
      errors.type = "Type is required";
    }
    if (!data.breed || data.breed.trim() === "") {
      errors.breed = "Breed is required";
    }
    if (!data.age || isNaN(data.age)) {
      errors.age = "Valid age is required";
    }
    if (!data.gender) {
      errors.gender = "Gender is required";
    }
    if (!data.color || data.color.trim() === "") {
      errors.color = "Color is required";
    }
    if (!data.weight || isNaN(data.weight)) {
      errors.weight = "Valid weight is required";
    }
    if (!data.dob) {
      errors.dob = "Date of birth is required";
    }
    if (!data.size) {
      errors.size = "Size is required";
    }
    if (!data.behavior) {
      errors.behavior = "Behavior is required";
    }
    if (!data.preview_image || data.preview_image.trim() === "") {
      errors.preview_image = "Preview image URL is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const petData = {
      ...updatedPet,
      dob: formatDate(updatedPet.dob), 
      image_urls: imageUrls.filter(url => url !== ''), 
      owner_id: currentUser.id, 
    };
    const validationErrors = validatePetData(petData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; 
    }
    try {
      await dispatch(updatePet({ petId, petData })).unwrap();
      await dispatch(fetchPetDetail(petId));
      onClose();
    } catch (backendErrors) {
      setErrors(backendErrors);
    }
  };

  if (!pet) {
    return <div>Loading...</div>;
  }

  return (
    <div className={petStyles.modal}>
      <div className={petStyles.modalContent}>
        <h2>Edit Pet</h2>
        <form onSubmit={handleSubmit}>
          {errors.name && <div className={petStyles.error}>{errors.name}</div>}
          <input className={petStyles.petInput} name="name" value={updatedPet.name} onChange={handleChange} placeholder="Name" required />
          {errors.type && <div className={petStyles.error}>{errors.type}</div>}
          <select className={petStyles.petInput} name="type" value={updatedPet.type} onChange={handleChange} required>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
          </select>
          {errors.breed && <div className={petStyles.error}>{errors.breed}</div>}
          <input className={petStyles.petInput} name="breed" value={updatedPet.breed} onChange={handleChange} placeholder="Breed" required />
          {errors.age && <div className={petStyles.error}>{errors.age}</div>}
          <input className={petStyles.petInput} name="age" value={updatedPet.age} onChange={handleChange} placeholder="Age" required />
          {errors.gender && <div className={petStyles.error}>{errors.gender}</div>}
          <div>
            <label>
              <input type="radio" name="gender" value="male" checked={updatedPet.gender === 'male'} onChange={handleChange} />
              Male
            </label>
            <label>
              <input type="radio" name="gender" value="female" checked={updatedPet.gender === 'female'} onChange={handleChange} />
              Female
            </label>
          </div>
          {errors.color && <div className={petStyles.error}>{errors.color}</div>}
          <input className={petStyles.petInput} name="color" value={updatedPet.color} onChange={handleChange} placeholder="Color" required />
          {errors.weight && <div className={petStyles.error}>{errors.weight}</div>}
          <input className={petStyles.petInput} name="weight" value={updatedPet.weight} onChange={handleChange} placeholder="Weight" required />
          {errors.dob && <div className={petStyles.error}>{errors.dob}</div>}
          <input className={petStyles.petInput} type="date" name="dob" value={updatedPet.dob} onChange={handleChange} placeholder="Date of Birth" required />
          {errors.size && <div className={petStyles.error}>{errors.size}</div>}
          <select className={petStyles.petInput} name="size" value={updatedPet.size} onChange={handleChange} required>
            <option value="a fine boi">A fine boi (16-26% Body Fat)</option>
            <option value="he chomnk">He chomnk (26-35% Body Fat)</option>
            <option value="a heckin chonker">A heckin chonker (26-45% Body Fat)</option>
            <option value="heftychonk">Heftychonk (46-55% Body Fat)</option>
            <option value="megachonker">Megachonker (56-65% Body Fat)</option>
            <option value="oh lawd he comin">Oh lawd he comin (65% Body Fat)</option>
          </select>
          {errors.behavior && <div className={petStyles.error}>{errors.behavior}</div>}
          <select className={petStyles.petInput} name="behavior" value={updatedPet.behavior} onChange={handleChange} required>
            <option value="calm">Calm</option>
            <option value="playful">Playful</option>
            <option value="aggressive">Aggressive</option>
            <option value="shy">Shy</option>
          </select>
          <input className={petStyles.petInput} name="medication_note" value={updatedPet.medication_note} onChange={handleChange} placeholder="Medication Note" />
          <input className={petStyles.petInput} name="dietary_note" value={updatedPet.dietary_note} onChange={handleChange} placeholder="Dietary Note" />
          {errors.preview_image && <div className={petStyles.error}>{errors.preview_image}</div>}
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