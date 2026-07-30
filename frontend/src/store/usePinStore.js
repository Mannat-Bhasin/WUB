// import { create } from "zustand";

// const API = "http://localhost:5000/api/pins";

// const authHeaders = (isJson = true) => {
//   const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
//   if (isJson) headers["Content-Type"] = "application/json";
//   return headers;
// };

// const usePinStore = create((set, get) => ({
//   pins: [],
//   favorites: [],
//   photos: [],

 
 

//   fetchPins: async () => {
//   const res = await fetch(API, { headers: authHeaders(false) });
//   if (!res.ok) throw new Error("Failed to fetch pins");
//   const data = await res.json();
//   set({ pins: data });
// },

//   addPin: async (name, lng, lat, userId) => {
//     const res = await fetch(API, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, lng, lat, userId }),
//     });
//     const newPin = await res.json(); 
//     set((state) => ({ pins: [...state.pins, newPin] }));
//     return newPin;
//   },

//   addPhotosToPin: async (id, files) => {
//   const formData = new FormData();

//   files.forEach((file) => formData.append("photos", file));
//   const res = await fetch(`${API}/${id}/photos`, {
//     method: "POST",
//     body: formData,
//   });

//   const { urls } = await res.json();

//   set((state) => ({
//     pins: state.pins.map((pin) =>
//       pin._id === id
//         ? {
//             ...pin,
//             photos: urls
//           }
//         : pin
//     ),
//   }));

//   return urls;
// },

// addFavorite: async (pin) => {
//     if (pin.isFavorite) return false;
//     try {
//       const res = await fetch(`${API_BASE}/pins/${pin._id}/favorite`, {
//         method: "PATCH",
//         headers: authHeaders(),
//         body: JSON.stringify({ isFavorite: true }),
//       });
//       if (!res.ok) throw new Error("Failed to add favorite");
//       const updated = await res.json();
//       set((state) => ({
//         pins: state.pins.map((p) => (p._id === updated._id ? updated : p)),
//         favorites: [...state.favorites, updated],
//       }));
//       return true;
//     } catch (err) {
//       console.error(err);
//       return false;
//     }
//   },

//   removeFavorite: async (id) => {
//     try {
//       const res = await fetch(`${API_BASE}/pins/${id}/favorite`, {
//         method: "PATCH",
//         headers: authHeaders(),
//         body: JSON.stringify({ isFavorite: false }),
//       });
//       if (!res.ok) throw new Error("Failed to remove favorite");
//       const updated = await res.json();
//       set((state) => ({
//         pins: state.pins.map((p) => (p._id === updated._id ? updated : p)),
//         favorites: state.favorites.filter((f) => f._id !== id),
//       }));
//     } catch (err) {
//       console.error(err);
//     }
//   },





// updatePinDescription: async (id, description) => {
//   const res = await fetch(`${API}/${id}`, {
//     method: "PATCH",
//     headers: authHeaders(),
//     body: JSON.stringify({ description }),
//   });
//    if (!res.ok) throw new Error("Failed to save description");

//   const updatedPin = await res.json();

//     set((state) => ({
//       pins: state.pins.map((p) => (p._id === updatedPin._id ? updatedPin : p)),
//       favorites: state.favorites.filter((f) => f._id !== updated._id), // no longer a favorite once photographed
//     }));
//     return updatedPin;
//   },

//   clearPins: () => set({ pins: [], favorites: [], pinsLoaded: false }),
// }));

// export default usePinStore;
import { create } from "zustand";

const API = "http://localhost:5000/api/pins";

const authHeaders = (isJson = true) => {
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
  if (isJson) headers["Content-Type"] = "application/json";
  return headers;
};

const usePinStore = create((set, get) => ({
  pins: [],
  favorites: [],
  photos: [],

  fetchPins: async () => {
    const res = await fetch(API, { headers: authHeaders(false) });
    if (!res.ok) throw new Error("Failed to fetch pins");
    const data = await res.json();
    set({ pins: data });
  },

  addPin: async (name, lng, lat) => {
    const res = await fetch(API, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ name, lng, lat }),
    });
    if (!res.ok) throw new Error("Failed to add pin");
    const newPin = await res.json();
    set((state) => ({ pins: [...state.pins, newPin] }));
    return newPin;
  },

  addPhotosToPin: async (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));

    const res = await fetch(`${API}/${id}/photos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // no Content-Type — browser sets multipart boundary
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload photos");

    const updatedPin = await res.json();

    set((state) => ({
      pins: state.pins.map((pin) =>
        pin._id === id ? { ...pin, photos: updatedPin.photos } : pin
      ),
    }));

    return updatedPin.photos;
  },

  addFavorite: async (pin) => {
    if (pin.isFavorite) return false;
    try {
      const res = await fetch(`${API}/${pin._id}/favorite`, {
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
      const res = await fetch(`${API}/${id}/favorite`, {
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

  updatePinDescription: async (id, description) => {
    const res = await fetch(`${API}/${id}/description`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ description }),
    });
    if (!res.ok) throw new Error("Failed to save description");

    const updatedPin = await res.json();

    set((state) => ({
      pins: state.pins.map((p) => (p._id === updatedPin._id ? updatedPin : p)),
      favorites: state.favorites.filter((f) => f._id !== updatedPin._id), // no longer a favorite once photographed
    }));
    return updatedPin;
  },

  clearPins: () => set({ pins: [], favorites: [], photos: [], pinsLoaded: false }),
}));

export default usePinStore;