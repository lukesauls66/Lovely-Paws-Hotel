import ProfileButton from "../Navigation/ProfileButton";
import lan from "./LandingPage.module.css"


function LandingPage() {
  return (
    <div className={lan.landingPageContainer}>
        <div className={lan.bannerContainer}>
            <img className={lan.logo} src="/images/logo-banner.jpg" alt="logo" />
            <div className={lan.profileButton}>
                <ProfileButton />
            </div>
        </div>
        <div className={lan.landingBodyContainer}>
            <div className={lan.messageContainer}>
                <img className={lan.pawLeft} src="/images/paw-left.png" alt="paw" />
                <h1 className={lan.messageBox}>YOUR PET&apos;S ULTIMATE VACATION AWAITS!</h1>
                <img className={lan.pawRight} src="/images/paw-right.png" alt="paw" />
            </div>

            <div className={lan.infoContainer}>
                <div className={lan.aboutBox}>
                    <h1>Welcome / About Us</h1>
                </div>
                <div className={lan.featuresBox}>
                    <h1>Features Buttons</h1>
                </div>
            </div>
        </div>
    </div>
  );
}

export default LandingPage;