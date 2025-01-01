import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPet } from "../../redux/pets";
import petStyles from "./AddPetModal.module.css";

const AddPetModal = ({ onClose, navigate }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("cat");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [color, setColor] = useState("");
  const [weight, setWeight] = useState("");
  const [dob, setDob] = useState("");
  const [size, setSize] = useState("a fine boi");
  const [behavior, setBehavior] = useState("calm");
  const [medicationNote, setMedicationNote] = useState("");
  const [dietaryNote, setDietaryNote] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);

  const petCreationValidationErrors = ({ name, breed, age, color, weight }) => {
    const validationErrors = {};

    if (name[0] !== name[0].toUpperCase()) {
      validationErrors.name = "Name must be capitalized";
    }

    if (breed[0] !== breed[0].toUpperCase()) {
      validationErrors.breed = "Breed must be capitalized";
    }

    if (isNaN(age) || age <= 0) {
      validationErrors.age = "Age must be a positive number";
    }

    if (color[0] !== color[0].toUpperCase()) {
      validationErrors.color = "Color must be capitalized";
    }

    if (isNaN(weight) || weight <= 0) {
      validationErrors.weight = "Weight must be a positive number";
    }

    return validationErrors;
  };

  const handlePreviewImageChange = (e) => {
    setPreviewImage(e.target.files[0]);
  };

  const handleAdditionalImageChange = (index, e) => {
    const newAdditionalImages = [...additionalImages];
    newAdditionalImages[index] = e.target.files[0];
    setAdditionalImages(newAdditionalImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const petCreationErrors = petCreationValidationErrors({
      name,
      breed,
      age,
      color,
      weight,
    });

    if (Object.keys(petCreationErrors).length > 0) {
      setErrors(petCreationErrors);
      return;
    }

    const formData = new FormData();
    const formattedDob = new Date(dob).toISOString().split("T")[0];

    formData.append("name", name);
    formData.append("type", type);
    formData.append("breed", breed);
    formData.append("age", String(age));
    formData.append("gender", gender);
    formData.append("color", color);
    formData.append("weight", String(weight));
    formData.append("size", size);
    formData.append("behavior", behavior);
    formData.append("medication_note", medicationNote);
    formData.append("dietary_note", dietaryNote);
    formData.append("dob", formattedDob);
    formData.append("owner_id", String(currentUser.id));

    if (previewImage) {
      formData.append("preview_image", previewImage);
    }

    additionalImages.forEach((file) => {
      if (file) {
        formData.append("additional_images", file);
      }
    });

    try {
      const newPet = await dispatch(addPet(formData)).unwrap();
      onClose();
      navigate(`/pets/${newPet.id}`);
    } catch (backendErrors) {
      setErrors(backendErrors);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={petStyles.modal}>
      <div className={petStyles.modalContent} ref={modalRef}>
        <h2>Add Pet</h2>
        <form onSubmit={handleSubmit}>
          <input
            className={petStyles.petInput}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          {errors.name && (
            <>
              <div className={petStyles.error}>{errors.name}</div>
              <br />
            </>
          )}
          <select
            className={petStyles.petInput}
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
          </select>
          {errors.type && (
            <>
              <div className={petStyles.error}>{errors.type}</div>
              <br />
            </>
          )}
          <input
            className={petStyles.petInput}
            name="breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="Breed"
            required
          />
          {errors.breed && (
            <>
              <div className={petStyles.error}>{errors.breed}</div>
              <br />
            </>
          )}
          <input
            className={petStyles.petInput}
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            required
          />
          {errors.age && (
            <>
              <div className={petStyles.error}>{errors.age}</div>
              <br />
            </>
          )}
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
              />
              Female
            </label>
          </div>
          {errors.gender && (
            <>
              <div className={petStyles.error}>{errors.gender}</div>
              <br />
            </>
          )}
          <input
            className={petStyles.petInput}
            name="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Color"
            required
          />
          {errors.color && (
            <>
              <div className={petStyles.error}>{errors.color}</div>
              <br />
            </>
          )}
          <input
            className={petStyles.petInput}
            name="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight"
            required
          />
          {errors.weight && (
            <>
              <div className={petStyles.error}>{errors.weight}</div>
              <br />
            </>
          )}
          <input
            className={petStyles.petInput}
            type="date"
            name="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="Date of Birth"
            required
          />
          {errors.dob && (
            <>
              <div className={petStyles.error}>{errors.dob}</div>
              <br />
            </>
          )}
          <select
            className={petStyles.petInput}
            name="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          >
            <option value="a fine boi">A fine boi (16-26% Body Fat)</option>
            <option value="he chomnk">He chomnk (26-35% Body Fat)</option>
            <option value="a heckin chonker">
              A heckin chonker (26-45% Body Fat)
            </option>
            <option value="heftychonk">Heftychonk (46-55% Body Fat)</option>
            <option value="megachonker">Megachonker (56-65% Body Fat)</option>
            <option value="oh lawd he comin">
              Oh lawd he comin (65% Body Fat)
            </option>
          </select>
          {errors.size && (
            <>
              <div className={petStyles.error}>{errors.size}</div>
              <br />
            </>
          )}
          <select
            className={petStyles.petInput}
            name="behavior"
            value={behavior}
            onChange={(e) => setBehavior(e.target.value)}
            required
          >
            <option value="calm">Calm</option>
            <option value="playful">Playful</option>
            <option value="aggressive">Aggressive</option>
            <option value="shy">Shy</option>
          </select>
          {errors.behavior && (
            <>
              <div className={petStyles.error}>{errors.behavior}</div>
              <br />
            </>
          )}
          <input
            className={petStyles.petInput}
            name="medicationNote"
            value={medicationNote}
            onChange={(e) => setMedicationNote(e.target.value)}
            placeholder="Medication Note"
          />
          <input
            className={petStyles.petInput}
            name="dietaryNote"
            value={dietaryNote}
            onChange={(e) => setDietaryNote(e.target.value)}
            placeholder="Dietary Note"
          />
          <input
            className={petStyles.petInput}
            name="preview_image"
            type="file"
            accept="image/*"
            onChange={(e) => handlePreviewImageChange(e)}
            placeholder="Preview Image URL"
            required
          />
          {errors.preview_image && (
            <>
              <div className={petStyles.error}>{errors.preview_image}</div>
              <br />
            </>
          )}
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              className={petStyles.petInput}
              name={`additional_image_${index}`}
              type="file"
              accept="image/*"
              onChange={(e) => handleAdditionalImageChange(index, e)}
              placeholder={`Additional Image ${index + 1}`}
            />
          ))}
          <button className={petStyles.petButton} type="submit">
            Add Pet
          </button>
          <button
            className={petStyles.petButton}
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;
