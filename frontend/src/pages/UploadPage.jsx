
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePinStore from "../store/usePinStore.js";

function UploadPage() {
  const { pinId } = useParams();
  const navigate = useNavigate();
  
  const updatePinDescription = usePinStore((state) => state.updatePinDescription)

  const pins = usePinStore((state) => state.pins);
  const fetchPins = usePinStore((state) => state.fetchPins);
  const addPhotosToPin = usePinStore((state) => state.addPhotosToPin);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (pins.length === 0) fetchPins();
  }, []);

//  useEffect(() => {
//   if (!pin) {
//     fetchPins(); // or better: fetchSinglePin(pinId) if you build that route
//   }
// }, [pinId]);

  const pin = pins.find((p) => p._id === pinId);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

 
  const handleSubmit = async () => {
  if (files.length === 0) return;
  setUploading(true);
  setError("");
  try {
    await addPhotosToPin(pin._id, files);
    if (description.trim()) {
      await updatePinDescription(pin._id, description.trim());
    }
    navigate("/home");
  } catch (err) {
    setError("Upload failed. Try again.");
  } finally {
    setUploading(false);
  }
};

  if (!pin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <p className="font-mono text-sm text-[#8C8577] tracking-wide">
          PIN NOT FOUND
        </p>
      </div>
    );
  }

  // pick up to 5 previews for the collage; fall back to placeholders
  const photosToDisplay =
  pin?.photos?.length > 0 ? pin.photos : previews;
  const collage = previews.slice(0, 25);
  const remaining = photosToDisplay.slice(10);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F2421]">
      <style>{`
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate("/home")}
          className="font-mono text-xs tracking-widest text-[#8C8577] hover:text-[#435E52] transition-colors mb-8"
        >
          ← BACK
        </button>

        {/* Collage + stamp */}
        <div className="relative mb-10">
          {collage.length > 0 ? (
            <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[420px]">
              {collage[0] && (
                <img
                  src={collage[0]}
                  className="col-span-1 row-span-1 w-full h-full object-cover rounded-sm"
                  alt=""
                />
              )}
              {collage[1] && (
                <img
                  src={collage[1]}
                  className="col-span-1 row-span-1 w-full h-full object-cover rounded-sm"
                  alt=""
                />
              )}
              <img
                src={collage[2] || collage[0]}
                className="col-span-2 row-span-2 w-full h-full object-cover rounded-sm"
                alt=""
              />
              {collage[3] && (
                <img
                  src={collage[3]}
                  className="col-span-1 row-span-1 w-full h-full object-cover rounded-sm"
                  alt=""
                />
              )}
              {collage[4] && (
                <img
                  src={collage[4]}
                  className="col-span-1 row-span-1 w-full h-full object-cover rounded-sm"
                  alt=""
                />
              )}
            
            
            {remaining.length > 0 && (
  <div className="mt-4 max-h-80 overflow-y-auto">
    <div className="grid grid-cols-4 gap-3">
      {remaining.map((photo, index) => (
        <img
          key={index}
          src={photo}
          alt=""
          className="w-full aspect-square object-cover rounded-sm"
        />
      ))}
    </div>
  </div>
)}
</div>
          ) : (
            <label className="flex flex-col items-center justify-center h-[420px] border border-dashed border-[#8C8577]/40 rounded-sm cursor-pointer hover:border-[#435E52] transition-colors">
              <span className="font-mono text-xs tracking-widest text-[#8C8577]">
                + ADD PHOTOS
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {/* field stamp */}
          {collage.length > 0 && (
            <div className="absolute -bottom-5 -right-3 bg-[#FAF7F2] border border-[#B5622D] rounded-full px-4 py-3 rotate-[-6deg] shadow-sm">
              <p className="font-mono text-[10px] text-[#B5622D] tracking-widest text-center leading-tight">
                {pin.lat?.toFixed(2)}°N<br />
                {pin.lng?.toFixed(2)}°E
              </p>
            </div>
          )}
        </div>

        {/* add more photos if collage already showing */}
        {collage.length > 0 && (
          <label className="inline-block font-mono text-xs tracking-widest text-[#435E52] border-b border-[#435E52] cursor-pointer mb-10 hover:opacity-70">
            CHANGE PHOTOS
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}

        {/* Heading */}
        <div className="mb-14">
          <p className="font-mono text-xs tracking-[0.2em] text-[#8C8577] mb-2">
            TRIP LOG
          </p>
          <h1 className="font-display text-6xl font-light text-[#1F2421] mb-3">
            {pin.name}
          </h1>
          <div className="flex items-center gap-3 font-mono text-xs text-[#8C8577] tracking-wide">
            <span>{pin.lat?.toFixed(4)}, {pin.lng?.toFixed(4)}</span>
            <span className="w-8 h-px bg-[#8C8577]/40" />
            <span>{files.length} PHOTO{files.length !== 1 ? "S" : ""}</span>
          </div>
        </div>

        {/* Editorial description section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start mb-14 pb-14 border-b border-[#1F2421]/10">
          <div className="md:col-span-2">
            {collage[1] || collage[0] ? (
              <img
                src={collage[1] || collage[0]}
                className="w-full aspect-[4/5] object-cover rounded-sm"
                alt=""
              />
            ) : (
              <div className="w-full aspect-[4/5] bg-[#1F2421]/5 rounded-sm" />
            )}
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-xs tracking-widest text-[#8C8577] mb-4">
              NOTES
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What made this place worth remembering?"
              rows={6}
              className="w-full bg-transparent font-display text-3xl leading-snug text-[#1F2421] placeholder:text-[#1F2421]/25 resize-none focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="font-mono text-xs text-[#B5622D] mb-4">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={uploading || files.length === 0}
          className="font-mono text-xs tracking-widest bg-[#1F2421] text-[#FAF7F2] px-8 py-4 rounded-sm hover:bg-[#435E52] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {uploading ? "SAVING…" : "SAVE TO TRIP LOG"}
        </button>
      </div>
    </div>
  );
}

export default UploadPage;