import { useState } from "react";
import LandingNavbar from "../components/LandingNavbar";
import LoginPopup from "../components/LoginPopup";
import SignupPopup from "../components/SignupPopup";

import landingVideo from "../assets/landing-page-bgvideo.mp4";

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="relative h-screen overflow-hidden">

      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-10" >
         <source src={landingVideo} type="video/mp4" /> 
      </video>

      <div className="relative top-0 left-0 w-full z-10">
        <LandingNavbar
          onLoginClick={() => setShowLogin(true)}
          onSignupClick={() => setShowSignup(true)}/>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-white text-3xl font-bold mb-4">Pin memories</h1>
        <button className="btn btn-primary" onClick={() => setShowSignup(true)}> Get Started </button>
      </div>

      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
      {showSignup && <SignupPopup onClose={() => setShowSignup(false)} />}
    </div>
  );
}

export default LandingPage;