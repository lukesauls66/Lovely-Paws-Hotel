import ProfileButton from "../Navigation/ProfileButton";
import lan from "./LandingPage.module.css"


function LandingPage() {
  return (
    <div className={lan.landingPageContainer}>
        <div className={lan.bannerContainer}>
            <img className={lan.logo} src="/images/logo-banner.jpg" alt="logo" />
        </div>
        <div className={lan.profileButton}>
            <ProfileButton />
        </div>
    </div>
  );
}

export default LandingPage;