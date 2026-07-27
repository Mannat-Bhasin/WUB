function LandingNavbar({ onLoginClick, onSignupClick }) {
  const clicked=()=>{
    console.log("clicked")
  }
  return (
    <nav className="navbar bg-transparent px-6">

      <div className="flex-1">
        <span className="text-xl font-bold">Pin Memories</span>
      </div>

      <div className="flex gap-2">
        <button className="btn btn-ghost" onClick={onLoginClick}> Login </button>
        <button className="btn btn-primary" onClick={onSignupClick}> Sign Up </button>
      </div>

    </nav>
  );
}

export default LandingNavbar;