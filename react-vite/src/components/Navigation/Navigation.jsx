import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import DemoButton from "./DemoButton";
import nav from "./Navigation.module.css";

function Navigation() {
  const currentUser = useSelector((state) => state.session.user);

  return (
    <div className={nav.navbarContainer}>
      <div>
        <NavLink to="/">
          <img src="/images/hotel.png" alt="Home" className={nav.homeBtn} />
        </NavLink>
      </div>
      <div className={nav.buttonContainer}>
        {currentUser ? null : (
          <div className={nav.demoButton}>
            <DemoButton />
          </div>
        )}
        <div className={nav.profileButton}>
          <ProfileButton />
        </div>
      </div>
    </div>
  );
}

export default Navigation;
