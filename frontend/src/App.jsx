import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import FavPage from "./pages/FavPage.jsx";
import PageSignup from "./pages/SignupPage.jsx"
import  PageLogin from "./pages/LoginPage.jsx"
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<ProtectedRoute>
            <HomePage />
        </ProtectedRoute>} />
      <Route path="/upload/:pinId" element={<ProtectedRoute>
            <UploadPage />
        </ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute>
            <FavPage />
        </ProtectedRoute>} />
      <Route path="/signup" element={<PageSignup />} />
      <Route path="/login" element={<PageLogin />} />

    </Routes>
  );
}

export default App;