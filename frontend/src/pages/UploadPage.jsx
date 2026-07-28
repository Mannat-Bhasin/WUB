import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePinStore from "../store/usePinStore.js";

function UploadPage() {
  const { pinId } = useParams();
  const navigate = useNavigate();
  const markPinPhotosUploaded = usePinStore((state) => state.markPinPhotosUploaded);

  const [photos, setPhotos] = useState([]); // { url, caption }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      url: URL.createObjectURL(file), // local preview only, no backend yet
      caption: "",
    }));
    setPhotos([...photos, ...newPhotos]);
    markPinPhotosUploaded(Number(pinId));
  };

  const handleCaptionChange = (index, value) => {
    const updated = [...photos];
    updated[index].caption = value;
    setPhotos(updated);
  };

  return (
    <div className="p-4">

      <button className="btn btn-ghost mb-4" onClick={() => navigate("/home")}> Go Back </button>

      <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mb-4" />

      <div className="flex flex-wrap gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="w-40">
            <img src={photo.url} alt="uploaded" className="w-full rounded-lg mb-1" />
            <input type="text" placeholder="Caption this" value={photo.caption} onChange={(e) => handleCaptionChange(index, e.target.value)}
              className="input input-bordered input-sm w-full"/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UploadPage;