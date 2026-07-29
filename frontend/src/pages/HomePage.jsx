import { useState, useRef, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import PinPopup from "../components/PinPopup";
import usePinStore from "../store/usePinStore";
import useAuthStore from "../store/useAuthStore"
// Map
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MAPBOX_STYLE =
  "mapbox://styles/riyaaagarg/cms4dk4p200ty01qk3ecgdkj4";

mapboxgl.accessToken = MAPBOX_TOKEN;

function HomePage() {
  const [query, setQuery] = useState("");
  const [activePin, setActivePin] = useState(null);
  const [searchError, setSearchError] = useState("");
  // const user = useAuthStore((state) => state.user);
  const auth = useAuthStore();

console.log("AUTH STORE:", auth);

const user = auth.user;
const fetchPins = usePinStore((state) => state.fetchPins);

  const pins = usePinStore((state) => state.pins);
  const addPin = usePinStore((state) => state.addPin);
  


  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLE,
      projection: "globe",
      zoom: 1.5,
      center: [0, 5], // move globe slightly downward
      padding: {
        top: 170, // keeps globe below navbar
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

  const handleSearch = async (e) => {
  e.preventDefault();

  if (!query.trim()) return;

  const place = query.trim();

  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        place
      )}.json?access_token=${MAPBOX_TOKEN}&limit=1&types=country,region,place`
    );

    const data = await res.json();
    const feature = data.features?.[0];

    if (!feature || feature.relevance < 0.6) {
      alert("Place not found. Try another search.");
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

    if (markerRef.current) markerRef.current.remove();

    markerRef.current = new mapboxgl.Marker({
      color: "#e11d48",
    })
      .setLngLat([lng, lat])
      .addTo(map);

    const newPin = await addPin(place, lng, lat, user.userId); // added await

    map.once("moveend", () => {
      setActivePin(newPin);
    });

    setQuery("");
  } catch (err) {
    console.error(err);
    alert("Something went wrong while searching.");
  }
};
console.log("yes rendering")

console.log("Current user:", user);

useEffect(() => {
  console.log("useeffect User:", user);
  if (user?.userId) {
    console.log("Fetching pins for:", user.userId);
    fetchPins(user.userId);   
  }
}, [user]);

useEffect(() => {
  if (!mapRef.current) return;

  
  pins.forEach((pin) => {
    new mapboxgl.Marker({ color: "#e11d48" })
      .setLngLat([pin.lng, pin.lat])
      .addTo(mapRef.current)
      .getElement()
      .addEventListener("click", () => setActivePin(pin));
  });
}, [pins]);

  // const handleSearch = async (e) => {
  //   e.preventDefault();

  //   if (!query.trim()) return;

  //   const place = query.trim();

  //   try {
  //     const res = await fetch(
  //       `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
  //         place
  //       )}.json?access_token=${MAPBOX_TOKEN}&limit=1&types=country,region,place`
  //     );

  //     const data = await res.json();
  //     const feature = data.features?.[0];

  //     if (!feature || feature.relevance < 0.6) {
  //       alert("Place not found. Try another search.");
  //       return;
  //     }

  //     const [lng, lat] = feature.center;
  //     const map = mapRef.current;

  //     map.flyTo({
  //       center: [lng, lat],
  //       zoom: 5,
  //       duration: 2500,
  //       essential: true,
  //     });

  //     if (markerRef.current) markerRef.current.remove();

  //     markerRef.current = new mapboxgl.Marker({
  //       color: "#e11d48",
  //     })
  //       .setLngLat([lng, lat])
  //       .addTo(map);

  //     const newPin = addPin(place, lng, lat);

  //     map.once("moveend", () => {
  //       setActivePin(newPin);
  //     });

  //     setQuery("");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Something went wrong while searching.");
  //   }
  // };

  return (
    <div className="relative h-screen w-screen overflow-hidden">

      {/* Background Globe */}
      <div ref={mapContainerRef}   className="fixed top-0 left-0 w-screen h-screen z-0" />

      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full z-50 px-6"><DashboardNavbar /> </div>

      {/* Search Section */}
      <div className="absolute top-24 left-0 z-50 px-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
          <input type="text" placeholder="Search a place" value={query} onChange={(e) => setQuery(e.target.value)} className="input input-bordered flex-1" />

          <button type="submit" className="btn bg-[#618687] text-white border-none hover:bg-[#4f7273]"> Search </button>
        </form>

        {searchError && (
          <p className="text-error text-sm mt-2">
            {searchError}
          </p>
        )}

        {/* <div className="flex flex-wrap gap-2 mt-6">
          {pins.map((pin) => (
            <button
              key={pin.id}
              onClick={() => setActivePin(pin)}
              className={`btn btn-sm ${pin.hasPhotos ? "btn-success" : "btn-error"
                }`}
            >
              {pin.name}
            </button>
          ))}
        </div> */}
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