import { useState, useEffect } from "react";
import LandingNavbar from "../components/LandingNavbar";
import LoginPopup from "../components/LoginPopup";
import SignupPopup from "../components/SignupPopup";
import { useNavigate } from 'react-router-dom'

import landingVideo from "../assets/landing-page-bgvideo.mp4";

function LandingPage() {
  
  const navigate = useNavigate()
  //names carousal
  const countries = ["Japan", "India", "Iceland", "Peru", "Italy"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % countries.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="relative h-screen overflow-hidden">

      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-10" >
        <source src={landingVideo} type="video/mp4" />
      </video>


      
          <div className="relative top-0 left-0 w-full z-10">
            <LandingNavbar onLoginClick={() => navigate('/login')} 
          onSignupClick={() => navigate('/signup')} />
          </div>

          <div className="relative z-10 flex flex-col items-start mt-20 pl-8 md:pl-16 h-full">
            <h1 className="text-white text-6xl font-bold mb-4 glass-text">Pin Your<br /> Memories
              <span key={index} className=" ml-4 inline-block  animate-[fadeSlide_0.5s_ease] text-[#618687]"> {countries[index]}</span>
            </h1>
            <p className="text-white max-w-[55%]">  Your life's too good to stay buried in your camera roll. Pin your
              memories, organize your favorite moments, and keep your story alive
              — with us. Every trip, every detour, every place that changed you
              turn it into a living map you can revisit anytime. No more scrolling
              through endless folders, just pin it, and it's yours forever.
            </p>
            <button className="glass glass-interactive glass-text rounded-full px-4 py-1.5 font-normal text-xl mt-5" onClick={() => setShowSignup(true)}> Get Started
            </button>
          </div>
        

      
    </div>
  );
}

export default LandingPage;


