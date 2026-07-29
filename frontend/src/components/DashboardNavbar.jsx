import { Link } from "react-router-dom";
import usePinStore from "../store/usePinStore";

function DashboardNavbar() {
  const favorites = usePinStore((state) => state.favorites);

  return (
    <nav className=" glass-dashboard mt-5 flex items-center rounded-2xl px-6 py-2.5 ">
      
      <div className="flex-1">
        <span className="text-xl font-bold font-['Cormorant'] text-white glass-interactive"><Link to="/">Where You Been</Link></span>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/favorites" className="flex items-center ">
          <span className="text-white"> ❤️{favorites.length }</span>
        </Link>
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;