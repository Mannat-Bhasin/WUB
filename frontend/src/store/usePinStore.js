import { create } from "zustand";

const API_BASE = "http://localhost:5000/api";

const authHeaders = (isJson = true) => {
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
  if (isJson) headers["Content-Type"] = "application/json";
  return headers;
};

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

  addFavorite: async (pin) => {
    if (pin.isFavorite) return false;
    try {
      const res = await fetch(`${API_BASE}/pins/${pin._id}/favorite`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ isFavorite: true }),
      });
      if (!res.ok) throw new Error("Failed to add favorite");
      const updated = await res.json();
      set((state) => ({
        pins: state.pins.map((p) => (p._id === updated._id ? updated : p)),
        favorites: [...state.favorites, updated],
      }));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  removeFavorite: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/pins/${id}/favorite`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ isFavorite: false }),
      });
      if (!res.ok) throw new Error("Failed to remove favorite");
      const updated = await res.json();
      set((state) => ({
        pins: state.pins.map((p) => (p._id === updated._id ? updated : p)),
        favorites: state.favorites.filter((f) => f._id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },

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

    set((state) => ({
      pins: state.pins.map((p) => (p._id === updated._id ? updated : p)),
      favorites: state.favorites.filter((f) => f._id !== updated._id), // no longer a favorite once photographed
    }));
    return updated;
  },

  updatePinDescription: async (pinId, description) => {
    const res = await fetch(`${API_BASE}/pins/${pinId}/description`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ description }),
    });
    if (!res.ok) throw new Error("Failed to update description");
    const updated = await res.json();
    set((state) => ({
      pins: state.pins.map((p) => (p._id === updated._id ? updated : p)),
      favorites: state.favorites.map((f) => (f._id === updated._id ? updated : f)),
    }));
    return updated;
  },

  clearPins: () => set({ pins: [], favorites: [], pinsLoaded: false }),
}));

export default usePinStore;