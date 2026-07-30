// import { Link } from "react-router-dom";
// import usePinStore from "../store/usePinStore";
// import pin from "../../../backend/models/pin";
// import useAuthStore from "../store/useAuthStore";



// function DashboardNavbar() {
//   const favorites = usePinStore((state) => state.favorites);
//   // const users = useAuthStore(((state) => state.);
 

//   return (
//     <nav className=" glass-dashboard mt-5 flex items-center rounded-2xl px-6 py-2.5 ">
      
//       <div className="flex-1">
//         <span className="text-xl font-bold font-['Cormorant'] text-white glass-interactive"><Link to="/">Where You Been</Link></span>
//       </div>
//       {/* <div className="flex-1">
//         <span className="text-xl font-bold font-['Cormorant'] text-white glass-interactive"><Link to="/">W.U.B</Link></span>
//       </div> */}

//       <div className="flex items-center gap-4">
//         <Link to="/favorites" className="flex items-center ">
//           <span className="text-white"> ❤️{favorites.length }</span>
//         </Link>
//         <div className="dropdown dropdown-end">
//       <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//         <div className="w-10 rounded-full">
//           {/* <img
//             alt="Tailwind CSS Navbar component"
//             src= {user.Profileimage} /> */}
//         </div>
//       </div>
//       <ul
//         tabIndex="-1"
//         className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
//         <li>
//           <a className="justify-between">
//             Profile
//             <span className="badge">New</span>
//           </a>
//         </li>
//         <li><a>Settings</a></li>
//         <li><a>Logout</a></li>
//       </ul>
//     </div>
//         {/* <div className="w-8 h-8 rounded-full bg-gray-300"></div> */}
//       </div>
//     </nav>
//   );
// }

// export default DashboardNavbar;

import { Link } from "react-router-dom";
import usePinStore from "../store/usePinStore";
import useAuthStore from "../store/useAuthStore";

function DashboardNavbar() {
  const favorites = usePinStore((state) => state.favorites);
  const user = useAuthStore((state) => state.user);

  return (
    <nav className=" glass-dashboard mt-5 flex items-center rounded-2xl px-6 py-2.5 ">
      <div className="flex-1">
        <span className="text-xl font-bold font-['Cormorant'] text-white glass-interactive">
          <Link to="/">Where You Been</Link>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/favorites" className="flex items-center ">
          <span className="text-white"> ❤️{favorites.length}</span>
        </Link>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="Profile" src={user?.ProfileImg} />
            </div>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;