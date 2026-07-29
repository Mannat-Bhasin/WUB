import { useNavigate } from "react-router-dom";
import usePinStore from "../store/usePinStore";

function PinPopup({ pin, onClose }) {
  const navigate = useNavigate();
  const addFavorite = usePinStore((state) => state.addFavorite);
  const favorites = usePinStore((state) => state.favorites);

  const isFavorited = favorites.some(
    (fav) => fav.name.toLowerCase() === pin.name.toLowerCase()
  );

  const handleUpload = () => {
    onClose();
    navigate(`/upload/${pin.id}`);
  };

  const handleAddToBucketList = () => {
    addFavorite(pin);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 ">
      <div className="bg-white p-6 rounded-lg w-72">
      

        <div className="flex flex-col gap-2">
          <button className="btn btn-primary" onClick={handleUpload}> Upload Photos </button>
          <button
            className="btn btn-secondary"
            onClick={handleAddToBucketList}
            disabled={isFavorited}
          >
            {isFavorited ? "Already in Bucket List" : "Add to Bucket List"}
          </button>
        </div>

        <button onClick={onClose} className="btn btn-ghost mt-2 w-full"> Close </button>
      </div>
    </div>
  );
}

export default PinPopup;