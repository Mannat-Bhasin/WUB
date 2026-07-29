import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import usePinStore from "../store/usePinStore";

//map
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_STYLE = "mapbox://styles/riyaaagarg/cms4dk4p200ty01qk3ecgdkj4";

mapboxgl.accessToken = MAPBOX_TOKEN;

function FavPage() {
  const favorites = usePinStore((state) => state.favorites);
  const removeFavorite = usePinStore((state) => state.removeFavorite);
  const pinsLoaded = usePinStore((state) => state.pinsLoaded);
  const navigate = useNavigate();

  const [activeFav, setActiveFav] = useState(null);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]); // { favId, marker }
  const mapLoadedRef = useRef(false);

  // init globe once
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
        const isMinorPlaceLabel = id.includes("settlement") && !id.includes("major");
        const isPoi = id.includes("poi");
        if (isMinorPlaceLabel || isPoi) {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });
      mapLoadedRef.current = true;
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapLoadedRef.current = false;
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!mapLoadedRef.current) return;
    const map = mapRef.current;
    if (!map) return;

    const existingIds = markersRef.current.map((m) => m.favId);
    const currentIds = favorites.map((f) => f._id);

    // remove markers for favorites that no longer exist
    markersRef.current = markersRef.current.filter((m) => {
      if (!currentIds.includes(m.favId)) {
        m.marker.remove();
        return false;
      }
      return true;
    });

    // add markers for new favorites only
    const validFavs = favorites.filter((f) => f.lng != null && f.lat != null);
    const newlyAdded = [];

    validFavs.forEach((fav) => {
      if (existingIds.includes(fav._id)) return;

      const marker = new mapboxgl.Marker({ color: "#ec4899" }) 
        .setLngLat([fav.lng, fav.lat])
        .addTo(map);

      marker.getElement().style.cursor = "pointer";
      marker.getElement().addEventListener("click", () => setActiveFav(fav));

      markersRef.current.push({ favId: fav._id, marker });
      newlyAdded.push(fav);
    });

    // only re-frame the camera when something was actually added —
    // removing a favorite should NOT move the camera at all
    if (newlyAdded.length > 0 && validFavs.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      validFavs.forEach((fav) => bounds.extend([fav.lng, fav.lat]));
      map.fitBounds(bounds, { padding: 60, maxZoom: 6, duration: 1000 });
    }
  }, [favorites]);

  const handleRemove = async () => {
    await removeFavorite(activeFav._id);
    setActiveFav(null);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Globe */}
      <div ref={mapContainerRef} className="fixed top-0 left-0 w-screen h-screen z-0" />

      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full z-50 px-6"><DashboardNavbar /> </div>

      {!pinsLoaded && (
        <div className="absolute top-24 left-0 z-50 px-6">
          <p className="text-white text-sm">Loading your wishlist…</p>
        </div>
      )}

      <div className="p-4 absolute bottom-5 left-300 z-50 px-6">
        <button className="btn bg-[#3d3939] text-white border-none hover:bg-[#282929] mb-4" onClick={() => navigate("/home")}> Go Back </button>
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