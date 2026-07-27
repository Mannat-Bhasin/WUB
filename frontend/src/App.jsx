import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import FavPage from "./pages/FavPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/upload/:pinId" element={<UploadPage />} />
      <Route path="/favorites" element={<FavPage />} />
    </Routes>
  );
}

export default App;