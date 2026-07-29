import { useState, useRef, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import PinPopup from "../components/PinPopup";
import usePinStore from "../store/usePinStore";

// Map
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_STYLE = "mapbox://styles/riyaaagarg/cms4dk4p200ty01qk3ecgdkj4";

mapboxgl.accessToken = MAPBOX_TOKEN;

function HomePage() {
  const [query, setQuery] = useState("");
  const [activePin, setActivePin] = useState(null);
  const [searchError, setSearchError] = useState("");

  const pins = usePinStore((state) => state.pins);
  const addPin = usePinStore((state) => state.addPin);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]); // { pinId, marker }

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLE,
      projection: "globe",
      zoom: 1.5,
      center: [0, 5],
      padding: {
        top: 170,
        left: 0,
        right: 0,
        bottom: 0,
      },
    });

    map.on("style.load", () => {
      map.setFog({});

      const style = map.getStyle();

      style.layers.forEach((layer) => {
        const id = layer.id.toLowerCase();

        const isMinorPlaceLabel =
          id.includes("settlement") && !id.includes("major");

        const isPoi = id.includes("poi");

        if (isMinorPlaceLabel || isPoi) {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  // Keep markers on the globe in sync with pins, and make each one clickable
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const plot = () => {
      const existingIds = markersRef.current.map((m) => m.pinId);
      const currentIds = pins.map((p) => p.id);

      // remove markers for pins that no longer exist
      markersRef.current = markersRef.current.filter((m) => {
        if (!currentIds.includes(m.pinId)) {
          m.marker.remove();
          return false;
        }
        return true;
      });

      // add markers for new pins only
      pins.forEach((pin) => {
        if (existingIds.includes(pin.id)) return;

        const marker = new mapboxgl.Marker({ color: "#e11d48" })
          .setLngLat([pin.lng, pin.lat])
          .addTo(map);

        marker.getElement().style.cursor = "pointer";
        marker.getElement().addEventListener("click", () => setActivePin(pin));

        markersRef.current.push({ pinId: pin.id, marker });
      });
    };

    if (map.isStyleLoaded()) {
      plot();
    } else {
      map.once("style.load", plot);
    }
  }, [pins]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    const place = query.trim();
    setSearchError("");

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          place
        )}.json?access_token=${MAPBOX_TOKEN}&limit=1&types=country,region,place`
      );

      const data = await res.json();
      const feature = data.features?.[0];

      if (!feature || feature.relevance < 0.6) {
        setSearchError("Place not found. Try another search.");
        return;
      }

      const [lng, lat] = feature.center;
      const map = mapRef.current;

      map.flyTo({
        center: [lng, lat],
        zoom: 5,
        duration: 2500,
        essential: true,
      });

      const newPin = addPin(place, lng, lat);

      map.once("moveend", () => {
        setActivePin(newPin);
      });

      setQuery("");
    } catch (err) {
      console.error(err);
      setSearchError("Something went wrong while searching.");
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">

      {/* Background Globe */}
      <div ref={mapContainerRef} className="fixed top-0 left-0 w-screen h-screen z-0" />

      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full z-50 px-6"><DashboardNavbar /> </div>

      {/* Search Section */}
      <div className="absolute top-24 left-0 z-50 px-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
          <input type="text" placeholder="Search a place" value={query} onChange={(e) => setQuery(e.target.value)} className="input input-bordered flex-1" />

          <button type="submit" className="btn bg-[#3d3939] hover:bg-[#282929] text-white border-none"> Search </button>
        </form>

        {searchError && (
          <p className="text-error text-sm mt-2">
            {searchError}
          </p>
        )}
      </div>

      {activePin && (
        <PinPopup
          pin={activePin}
          onClose={() => setActivePin(null)}
        />
      )}
    </div>
  );
}

export default HomePage;