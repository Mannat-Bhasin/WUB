import { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import PinPopup from "../components/PinPopup";
import usePinStore from "../store/usePinStore";

function HomePage() {
  const [query, setQuery] = useState("");
  const [activePin, setActivePin] = useState(null);
  
  const pins = usePinStore((state) => state.pins);
  const addPin = usePinStore((state) => state.addPin);

  const handleSearch = (e) => {
    e.preventDefault(); // stop the form's default page-reload behavior
    if (!query.trim()) return;
    addPin(query.trim());
    setQuery("");
  };

  return (
    <div>
      <DashboardNavbar />

      <div className="p-4">

        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input type="text" placeholder="Search a place" value={query} onChange={(e) => setQuery(e.target.value)}
            className="input input-bordered flex-1"/>
          <button type="submit" className="btn btn-primary"> Search </button>
        </form>

        <div className="bg-gray-100 h-96 rounded-lg p-4">
          <p className="text-gray-500 mb-2">World map (placeholder)</p>
          <div className="flex flex-wrap gap-2">
            {pins.map((pin) => (
              <button key={pin.id} onClick={() => setActivePin(pin)} className={`btn btn-sm ${pin.hasPhotos ? "btn-success" : "btn-error"}`}>
                {pin.name}</button>
            ))}
          </div>
        </div>

      </div>

      {activePin && <PinPopup pin={activePin} onClose={() => setActivePin(null)} />}
    </div>
  );
}

export default HomePage;