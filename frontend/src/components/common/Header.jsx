import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/authSlice.jsx";
import { TiStar } from "react-icons/ti";
import GoogleSignInButton from "../GoogleSignInButton.jsx";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { signupData } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate("/");
  };

  const AuthButtons = () => (
    <div className="flex items-center gap-x-4">
      {!signupData ? <GoogleSignInButton /> : <button onClick={handleLogout} className="bg-teal-400 text-slate-900 px-4 py-2 rounded-md hover:bg-teal-500 transition-colors">Logout</button>}
      {signupData && <img src={signupData.picture} alt="" className="rounded-full w-12" />}
    </div>
  );

  const MembershipButton = () => (
    <>
      {!signupData?.isSubscribed ? (
        <Link to="/payment" className="bg-orange-800 text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-500 transition-colors">Go Pro</Link>
      ) : (
        <div className="bg-orange-800 flex items-center gap-1 text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-500 transition-colors">
          <TiStar color="yellow" size={24} /> Member
        </div>
      )}
    </>
  );

  return createPortal(
    <header className="w-full bg-slate-900 text-white py-4 fixed top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-teal-400 rounded-full"></div>
          <span className="ml-2 text-xl font-semibold text-teal-400">Ai Peer Academy</span>
        </div>

        <nav className="hidden md:flex flex-1 justify-center space-x-8">
          <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
          <a href="#" className="hover:text-teal-400 transition-colors">About</a>
          <Link to="/contact" className="hover:text-teal-400 transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-x-4">
          <AuthButtons />
          <MembershipButton />
        </div>

        <button className="md:hidden text-2xl p-2" onClick={toggleMenu} aria-label="Toggle Menu">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        <nav className="flex flex-col items-center space-y-4 pt-4 pb-2">
          <Link to="/" className="py-2 hover:text-teal-400 transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
          <a href="#" className="py-2 hover:text-teal-400 transition-colors" onClick={() => setIsOpen(false)}>About</a>
          <Link to="/contact" className="py-2 hover:text-teal-400 transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
          <AuthButtons />
          <MembershipButton />
        </nav>
      </div>
    </header>,
    document.getElementById("header")
  );
}

export default Header;
