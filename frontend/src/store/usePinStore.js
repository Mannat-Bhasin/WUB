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
  pinsLoaded: false,

  fetchPins: async () => {
    try {
      const res = await fetch(`${API_BASE}/pins`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch pins");
      const data = await res.json();
      set({
        pins: data,
        favorites: data.filter((p) => p.isFavorite),
        pinsLoaded: true,
      });
    } catch (err) {
      console.error(err);
    }
  },

  addPin: async (name, lng, lat) => {
    try {
      const res = await fetch(`${API_BASE}/pins`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name, lng, lat }),
      });
      if (!res.ok) throw new Error("Failed to add pin");
      const newPin = await res.json();
      set((state) => ({ pins: [...state.pins, newPin] }));
      return newPin;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

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

  addPhotosToPin: async (pinId, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));

    const res = await fetch(`${API_BASE}/pins/${pinId}/photos`, {
      method: "POST",
      headers: authHeaders(false),
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload photos");
    const updated = await res.json();

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