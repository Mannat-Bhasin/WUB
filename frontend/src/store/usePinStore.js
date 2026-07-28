import { create } from "zustand";

const usePinStore = create((set, get) => ({
  pins: [],
  favorites: [],

  addPin: (name, lng, lat) => {
    const newPin = { id: Date.now(), name, lng, lat, hasPhotos: false };
    set((state) => ({
      pins: [...state.pins, newPin],
    }));
    return newPin;
  },

  markPinPhotosUploaded: (id) =>
    set((state) => ({
      pins: state.pins.map((pin) =>
        pin.id === id ? { ...pin, hasPhotos: true } : pin
      ),
    })),

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