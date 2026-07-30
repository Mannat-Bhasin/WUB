import { create } from "zustand";
import { persist } from "zustand/middleware";


const savedUser = JSON.parse(localStorage.getItem("user"));

const useAuthStore = create(
  persist(
    
  (set) => ({
  isLoggedIn: !!savedUser,
  user: savedUser,

  login: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token);

    set({
      isLoggedIn: true,
      user,
    });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      isLoggedIn: false,
      user: null,
    });
    
  },
  
}),
));

export default useAuthStore;