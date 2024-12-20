import profile from "./ProfileButton.module.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoPawOutline } from "react-icons/io5";
import * as sessionActions from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const pawIcon = <IoPawOutline className={profile.profileIcon} />;

  return (
    <div className={profile.profileButton}>
      <button onClick={toggleMenu}>{pawIcon}</button>
      {showMenu && (
        <ul className={profile.profileDropdown} ref={ulRef}>
          {user?.username ? (
            <>
              <li>{user.username}</li>
              <li>{user.email}</li>
              <br />
              <li>
                <button onClick={logout} className={profile.modalButton}>Log Out</button>
              </li>
            </>
          ) : (
            <div className={profile.modalButtonContainer}>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
                className={profile.modalButton}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
                className={profile.modalButton}
              />
            </div>
          )}
        </ul>
      )}
    </div>


  );
}

export default ProfileButton;
