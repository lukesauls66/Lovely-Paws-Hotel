import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import DemoButton from "./DemoButton";
import nav from "./Navigation.module.css";

function Navigation() {
  return (
    <div className={nav.navbarContainer}>
      <div>
        <NavLink to="/">
          <img src="/images/hotel.png" alt="Home" className={nav.homeBtn} />
        </NavLink>
      </div>
      <div>
        <DemoButton />
        <ProfileButton />
      </div>
    </div>
  );
}

export default Navigation;
