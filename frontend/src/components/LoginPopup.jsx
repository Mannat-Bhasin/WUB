import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";

function LoginPopup({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // no backend yet — just fake the login for now
    login();
    navigate("/home");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered"/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered"/>
          <button type="submit" className="btn btn-primary mt-2"> Login </button>
        </form>
        <button onClick={onClose} className="btn btn-ghost mt-2 w-full"> Close </button>
      </div>
    </div>
  );
}

export default LoginPopup;