import { useNavigate } from "react-router-dom";
import usePinStore from "../store/usePinStore";

function PinPopup({ pin, onClose }) {
  const navigate = useNavigate();
  const addFavorite = usePinStore((state) => state.addFavorite);

  const handleUpload = () => {
    onClose();
    navigate(`/upload/${pin._id}`);
  };

  const handleAddToBucketList = async () => {
    await addFavorite(pin);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 ">
      <div className="glass-pinpopup p-6 rounded-lg w-72">
        <div className="flex flex-col gap-2">
          <button className="btn bg-[#355653] text-white border-none" onClick={handleUpload}> Upload Photos </button>
          <button className="btn bg-[#e64e67] text-white border-none" onClick={handleAddToBucketList} disabled={pin.isFavorite}>
            {pin.isFavorite ? "Already in Bucket List" : "Add to Bucket List"} </button>
        </div>

        <button onClick={onClose} className="btn btn-ghost mt-2 w-full text-[#696666]"> Close </button>
      </div>
    </div>
  );
}

export default PinPopup;