import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePinStore from "../store/usePinStore";

function FavPage() {
  const favorites = usePinStore((state) => state.favorites);
  const removeFavorite = usePinStore((state) => state.removeFavorite);
  const navigate = useNavigate();

  const [activeFav, setActiveFav] = useState(null);

  const handleRemove = () => {
    removeFavorite(activeFav.id);
    setActiveFav(null);
  };

  return (
    <div className="p-4">
      <button className="btn btn-ghost mb-4" onClick={() => navigate("/home")}> Go Back </button>

      <h1 className="text-xl font-bold mb-4">Your Wishlist Map</h1>

      <div className="bg-gray-100 h-96 rounded-lg p-4">
        <p className="text-gray-500 mb-2">Wishlist map (placeholder)</p>
        <div className="flex flex-wrap gap-2">
          {favorites.map((fav) => (
            <button
              key={fav.id}
              onClick={() => setActiveFav(fav)}
              className="btn btn-sm btn-info"
            >
              {fav.name}
            </button>
          ))}
        </div>
      </div>

      {activeFav && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg w-72">
            <h2 className="text-lg font-bold mb-4">{activeFav.name}</h2>
            <button className="btn btn-error w-full" onClick={handleRemove}> Remove from Bucket List </button>
            <button className="btn btn-ghost mt-2 w-full" onClick={() => setActiveFav(null)}> Close </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FavPage;