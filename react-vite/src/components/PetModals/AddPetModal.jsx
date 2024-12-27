import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPet } from "../../redux/pets";
import petStyles from "./AddPetModal.module.css";

const AddPetModal = ({ onClose, navigate }) => {
  // const [pet, setPet] = useState({
  //   name: "",
  //   type: "cat",
  //   breed: "",
  //   age: "",
  //   gender: "male",
  //   color: "",
  //   weight: "",
  //   dob: "",
  //   size: "a fine boi",
  //   behavior: "calm",
  //   medication_note: "",
  //   dietary_note: "",
  // });
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

  // const validatePetData = (data) => {
  //   const errors = {};
  //   if (!data.name || data.name.trim() === "") {
  //     errors.name = "Pet name is required";
  //   }
  //   if (!data.type) {
  //     errors.type = "Type is required";
  //   }
  //   if (!data.breed || data.breed.trim() === "") {
  //     errors.breed = "Breed is required";
  //   }
  //   if (!data.age || isNaN(data.age)) {
  //     errors.age = "Valid age is required";
  //   }
  //   if (!data.gender) {
  //     errors.gender = "Gender is required";
  //   }
  //   if (!data.color || data.color.trim() === "") {
  //     errors.color = "Color is required";
  //   }
  //   if (!data.weight || isNaN(data.weight)) {
  //     errors.weight = "Valid weight is required";
  //   }
  //   if (!data.dob) {
  //     errors.dob = "Date of birth is required";
  //   }
  //   if (!data.size) {
  //     errors.size = "Size is required";
  //   }
  //   if (!data.behavior) {
  //     errors.behavior = "Behavior is required";
  //   }
  //   if (!data.preview_image || data.preview_image.trim() === "") {
  //     errors.preview_image = "Preview image URL is required";
  //   }
  //   return errors;
  // };

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

    const formData = new FormData();
    const formattedDob = new Date(dob).toISOString().split("T")[0];

    console.log("Adding values to FormData:");

    // Object.keys(pet).forEach(([key, value]) => {
    //   if (key !== "dob") {
    //     console.log(`${key}:`, value, typeof value);
    //     formData.append(key, value === null ? "" : String(value));
    //   }
    // });
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
    console.log("name", name);
    console.log("type", type);
    console.log("breed", breed);
    console.log("age", age);
    console.log("gender", gender);
    console.log("color", color);
    console.log("weight", weight);
    console.log("size", size);
    console.log("behavior", behavior);
    console.log("medication_note", medicationNote);
    console.log("dietary_note", dietaryNote);

    console.log("dob:", formattedDob);
    formData.append("dob", formattedDob);
    console.log("owner_id", currentUser.id);
    formData.append("owner_id", String(currentUser.id));

    if (previewImage) {
      console.log("preview_image:", previewImage);
      formData.append("preview_image", previewImage);
    }

    additionalImages.forEach((file, index) => {
      if (file) {
        console.log(`additional_image_${index}:`, file);
        formData.append("additional_images", file);
      }
    });

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

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
          {errors.name && <div className={petStyles.error}>{errors.name}</div>}
          <input
            className={petStyles.petInput}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          {errors.type && <div className={petStyles.error}>{errors.type}</div>}
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
          {errors.breed && (
            <div className={petStyles.error}>{errors.breed}</div>
          )}
          <input
            className={petStyles.petInput}
            name="breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="Breed"
            required
          />
          {errors.age && <div className={petStyles.error}>{errors.age}</div>}
          <input
            className={petStyles.petInput}
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            required
          />
          {errors.gender && (
            <div className={petStyles.error}>{errors.gender}</div>
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
          {errors.color && (
            <div className={petStyles.error}>{errors.color}</div>
          )}
          <input
            className={petStyles.petInput}
            name="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Color"
            required
          />
          {errors.weight && (
            <div className={petStyles.error}>{errors.weight}</div>
          )}
          <input
            className={petStyles.petInput}
            name="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight"
            required
          />
          {errors.dob && <div className={petStyles.error}>{errors.dob}</div>}
          <input
            className={petStyles.petInput}
            type="date"
            name="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="Date of Birth"
            required
          />
          {errors.size && <div className={petStyles.error}>{errors.size}</div>}
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
          {errors.behavior && (
            <div className={petStyles.error}>{errors.behavior}</div>
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
          {errors.preview_image && (
            <div className={petStyles.error}>{errors.preview_image}</div>
          )}
          <input
            className={petStyles.petInput}
            name="preview_image"
            type="file"
            accept="image/*"
            onChange={(e) => handlePreviewImageChange(e)}
            placeholder="Preview Image URL"
            required
          />
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
