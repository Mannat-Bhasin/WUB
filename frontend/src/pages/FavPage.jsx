import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import usePinStore from "../store/usePinStore";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_STYLE = "mapbox://styles/riyaaagarg/cms4dk4p200ty01qk3ecgdkj4";

mapboxgl.accessToken = MAPBOX_TOKEN;

function FavPage() {
  const favorites = usePinStore((state) => state.favorites);
  const removeFavorite = usePinStore((state) => state.removeFavorite);
  const navigate = useNavigate();

  const [activeFav, setActiveFav] = useState(null);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // init globe once
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLE,
      projection: "globe",
      zoom: 1.5,
      center: [0, 20],
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
    });

    mapRef.current = map;
    return () => map.remove();
  }, []);

  // re-plot pink markers whenever favorites changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const plot = () => {
      // clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const validFavs = favorites.filter((f) => f.lng != null && f.lat != null);

      validFavs.forEach((fav) => {
        const marker = new mapboxgl.Marker({ color: "#ec4899" }) // pink-500
          .setLngLat([fav.lng, fav.lat])
          .addTo(map);

        marker.getElement().style.cursor = "pointer";
        marker.getElement().addEventListener("click", () => setActiveFav(fav));

        markersRef.current.push(marker);
      });

      if (validFavs.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        validFavs.forEach((fav) => bounds.extend([fav.lng, fav.lat]));
        map.fitBounds(bounds, { padding: 60, maxZoom: 6, duration: 1000 });
      }
    };

    if (map.isStyleLoaded()) {
      plot();
    } else {
      map.once("style.load", plot);
    }
  }, [favorites]);

  const handleRemove = () => {
    removeFavorite(activeFav.id);
    setActiveFav(null);
  };

  return (
    <div>
      <DashboardNavbar />

      <div className="p-4">
        <button className="btn btn-ghost mb-4" onClick={() => navigate("/home")}> Go Back </button>

        <h1 className="text-xl font-bold mb-4">Your Wishlist Map</h1>

        <div ref={mapContainerRef} className="w-full h-96 rounded-lg overflow-hidden" />

        <div className="flex flex-wrap gap-2 mt-4">
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