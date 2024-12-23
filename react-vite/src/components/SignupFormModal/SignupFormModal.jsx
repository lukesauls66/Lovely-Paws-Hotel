import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../redux/session";
import signup from "./SignupForm.module.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone_num, setPhone_num] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  console.log("Errors: ", errors);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fname[0] !== fname[0].toUpperCase()) {
      return setErrors({
        fname: "First name must be capitalized",
      });
    }

    if (lname[0] !== lname[0].toUpperCase()) {
      return setErrors({
        lname: "Last name must be capitalized",
      });
    }

    if (isNaN(phone_num)) {
      return setErrors({
        phone_num: "Phone number must be a number",
      });
    }

    if (phone_num.length !== 10) {
      return setErrors({
        phone_num: "Phone number must be 10 digits long",
      });
    }

    if (isNaN(address.split(" ")[0])) {
      return setErrors({
        address: "Address must start with a number",
      });
    }

    if (
      address
        .split(" ")
        .slice(1)
        .forEach((word) => {
          word[0] !== word[0].toUpperCase();
        })
    ) {
      return setErrors({
        address: "All first letters must be capitalized",
      });
    }

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      sessionActions.signup({
        username,
        email,
        password,
        fname,
        lname,
        phone_num,
        address,
        city,
        state,
        zip,
      })
    );
    console.log("Server res: ", serverResponse);

    if (serverResponse.type === "session/signup/rejected") {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className={signup.signupModalContainer}>
      <h1 className={signup.h1}>Sign Up</h1>
      {errors.server && <p>{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.payload?.email && <p>{errors.payload.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.payload?.username && <p>{errors.payload.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </label>
        {errors.fname && <p>{errors.fname}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            required
          />
        </label>
        {errors.lname && <p>{errors.lname}</p>}
        <label>
          Phone Number
          <input
            type="text"
            value={phone_num}
            onChange={(e) => setPhone_num(e.target.value)}
            required
          />
        </label>
        {errors.phone_num && <p>{errors.phone_num}</p>}
        <label>
          Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        {errors.address && <p>{errors.address}</p>}
        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        {errors.city && <p>{errors.city}</p>}
        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        {errors.state && <p>{errors.state}</p>}
        <label>
          Zip
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
          />
        </label>
        {errors.zip && <p>{errors.zip}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit" className={signup.signupSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
