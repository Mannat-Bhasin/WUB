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
  const navigate = useNavigate();

  const [activeFav, setActiveFav] = useState(null);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]); // { favId, marker }

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
    });

    mapRef.current = map;
    return () => map.remove();
  }, []);

  // keep markers in sync with favorites, click opens remove popup
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const plot = () => {
      const existingIds = markersRef.current.map((m) => m.favId);
      const currentIds = favorites.map((f) => f.id);

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

      validFavs.forEach((fav) => {
        if (existingIds.includes(fav.id)) return;

        const marker = new mapboxgl.Marker({ color: "#ec4899" }) // pink-500
          .setLngLat([fav.lng, fav.lat])
          .addTo(map);

        marker.getElement().style.cursor = "pointer";
        marker.getElement().addEventListener("click", () => setActiveFav(fav));

        markersRef.current.push({ favId: fav.id, marker });
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

      <div className="p-4 absolute bottom-5 left-300 z-50 px-6">
        <button className="btn bg-[#3d3939] text-white border-none hover:bg-[#282929] mb-4" onClick={() => navigate("/home")}> Go Back </button>
      </div>

      {activeFav && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="glass-pinpopup p-6 rounded-lg w-72">
            <h2 className="text-lg font-bold mb-4 text-[#cec8c8]">{activeFav.name}</h2>
            <button className="btn bg-[#e64e67] text-white border-none w-full" onClick={handleRemove}> Remove from Bucket List </button>
            <button className="btn btn-ghost mt-2 w-full text-[#696666]" onClick={() => setActiveFav(null)}> Close </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FavPage;