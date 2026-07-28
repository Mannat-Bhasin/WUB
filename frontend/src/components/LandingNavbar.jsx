function LandingNavbar({ onLoginClick, onSignupClick }) {
  return (
    <nav className="glass mx-8 mt-5 flex items-center rounded-2xl px-6 py-2.5">

      <div className="flex-1">
        <span className="glass-text text-[1.2rem] font-medium tracking-tight"> Where You Been </span>
      </div>
      {/* <div className="flex ">
      <img className="w-40"src="/wub_logo_variations1.png" alt="logo"/> */}

      <div className="flex  items-center gap-2">
        <button onClick={onLoginClick} className="glass-text rounded-full px-4 py-1.5 text-sm font-normal transition duration-300 hover:bg-white/10" > Login </button>

        <button onClick={onSignupClick} className="glass glass-interactive glass-text rounded-full px-4 py-1.5 text-sm font-normal">  Sign Up </button>
      </div>
      {/* </div> */}

    </nav>
  );
}

export default LandingNavbar;