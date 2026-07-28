import { Link } from "react-router-dom";
import usePinStore from "../store/usePinStore.js";

function DashboardNavbar() {
  const favorites = usePinStore((state) => state.favorites);

  return (
    <nav className="navbar bg-base-100 px-6">
      
      <div className="flex-1">
        <span className="text-xl font-bold">Pin Memories</span>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/favorites" className="flex items-center gap-1">
          <span>♥</span>
          <span>{favorites.length}</span>
        </Link>
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;