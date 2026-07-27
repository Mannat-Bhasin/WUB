import { create } from "zustand";

const usePinStore = create((set) => ({
  pins: [],
  favorites: [],

  addPin: (name) =>
    set((state) => ({
      pins: [...state.pins, { id: Date.now(), name, hasPhotos: false }],
    })),

  markPinPhotosUploaded: (id) =>
    set((state) => ({
      pins: state.pins.map((pin) =>
        pin.id === id ? { ...pin, hasPhotos: true } : pin
      ),
    })),

  addFavorite: (name) =>
    set((state) => ({
      favorites: [...state.favorites, { id: Date.now(), name }],
    })),

  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((fav) => fav.id !== id),
    })),
}));

export default usePinStore;