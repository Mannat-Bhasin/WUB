import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function LoginPopup({ onClose, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login();
    navigate("/home");
  };

  return (
    <div className="glass glass-flat panel-enter fixed inset-y-0 left-0 z-30 w-[55%] flex flex-col items-center justify-center pb-10 h-[100vh]">

      <button onClick={onClose} className="glass-text absolute top-0 right-8 text-2xl leading-none opacity-60 transition hover:opacity-100">✕</button>

      <div className="w-full max-w-md">
       
        <h2 className="glass-text mb-2 text-4xl font-bold">Welcome back</h2>
        <p className="mb-8 text-white/60 text-sm">Pick up where you left off.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="glass-input w-full rounded-xl px-4 py-3 text-sm"/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="glass-input w-full rounded-xl px-4 py-3 text-sm"/>
          <button type="submit" className="glass glass-interactive glass-text mt-2 rounded-full px-6 py-3 text-sm font-medium"> Login </button>
        </form>

        <p className="mt-6 text-sm text-white/60">
          New here?{" "}
          <button onClick={onSwitch} className="text-white/90 underline underline-offset-4 transition hover:text-white">Sign up</button>
        </p>
      </div>

    </div>
  );
}

export default LoginPopup;