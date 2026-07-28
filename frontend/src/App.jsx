import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import FavPage from "./pages/FavPage.jsx";
import PageSignup from "./pages/SignupPage.jsx"
import  PageLogin from "./pages/LoginPage.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/upload/:pinId" element={<UploadPage />} />
      <Route path="/favorites" element={<FavPage />} />
      <Route path="/signup" element={<PageSignup />} />
      <Route path="/login" element={<PageLogin />} />

    </Routes>
  );
}

export default App;