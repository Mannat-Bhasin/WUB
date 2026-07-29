import { create } from "zustand";
const API = "http://localhost:5000/api/pins";

const usePinStore = create((set, get) => ({
  pins: [],
  favorites: [],
  photos: [],

 
 
fetchPins: async (userId) => {
  console.log("User ID:", userId);
  const url = userId ? `${API}?userId=${userId}` : API;
  console.log("URL:", url);
  const res = await fetch(url);
  const data = await res.json();
  set({ pins: data });
},

  addPin: async (name, lng, lat, userId) => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, lng, lat, userId }),
    });
    const newPin = await res.json(); 
    set((state) => ({ pins: [...state.pins, newPin] }));
    return newPin;
  },

  addPhotosToPin: async (id, files) => {
  const formData = new FormData();

  files.forEach((file) => formData.append("photos", file));

  const res = await fetch(`${API}/${id}/photos`, {
    method: "POST",
    body: formData,
  });

  const { urls } = await res.json();

  set((state) => ({
    pins: state.pins.map((pin) =>
      pin._id === id
        ? {
            ...pin,
            photos: urls
          }
        : pin
    ),
  }));

  return urls;
},





updatePinDescription: async (id, description) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });

  if (!res.ok) throw new Error("Failed to save description");

  const updatedPin = await res.json();

  set((state) => ({
    pins: state.pins.map((pin) =>
      pin._id === id ? updatedPin : pin
    ),
  }));

  return updatedPin;
},

 
  addFavorite: (pin) =>
    set((state) => ({
      favorites: [
        ...state.favorites,
        { id: Date.now(), name: pin.name, lng: pin.lng, lat: pin.lat },
      ],
    })),

  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((fav) => fav.id !== id),
    })),
}));

export default usePinStore;