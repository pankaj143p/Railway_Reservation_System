import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "./ui/button/button";
import logo from "../../public/static/logo.png";

const Navbar = () => {
  const isLogged = !!localStorage.getItem("token")
  const location = useLocation();
  console.log("Is user logged in:", isLogged);

  const [mobileOpen, setMobileOpen] = useState(false);

  // Helper function to determine if a link is active
  const isActiveLink = (path: string) => {
    if (path === "/home") {
      return location.pathname === "/home" || location.pathname === "/";
    }
    return location.pathname === path;
  };

  // Helper function to get link classes
  const getLinkClasses = (path: string, isMobile = false) => {
    const baseClasses = isMobile 
      ? "block rounded-md px-3 py-2 text-base font-medium"
      : "rounded-md px-2 py-1 text-sm font-medium";
    
    const isActive = isActiveLink(path);
    
    if (isActive) {
      return `${baseClasses} bg-gray-700 text-white`;
    }
    
    return `${baseClasses} text-gray-300 hover:bg-gray-700 hover:text-white`;
  };

  return (
    <nav className="bg-gray-800 w-full fixed top-0 left-0 z-50 shadow">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
          {/* Logo and desktop menu */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src={logo}
                alt="logo"
              />
            </div>
            <div className="hidden sm:flex sm:ml-6 flex-1">
              <div className="flex flex-row justify-between w-full items-center">
                <h1 className="text-center p-3 rounded-xl text-xl font-extrabold py-1 text-gray-300 hover:text-stone-400 cursor-context-menu">
                  I Rail gateway
                </h1>
                <div className="flex space-x-6 items-center">
                  <Link to="/home" className={getLinkClasses("/home")}>
                    Home
                  </Link>
                    <Link to="/trainList" className={getLinkClasses("/about", true)}>
                Search Trains
              </Link>

                  {isLogged ? (
                    <Link to="/bookedtickets" className={getLinkClasses("/bookedtickets")}>
                      Booked Tickets
                    </Link>
                  ) : (
                    <>
                      <Link to="/about" className={getLinkClasses("/about")}>
                        About
                      </Link>
                      <Link to="/services" className={getLinkClasses("/services")}>
                        Services
                      </Link>
                    </>
                  )}
                  <Link to="/policy" className={getLinkClasses("/policy")}>
                    Policy
                  </Link>
                  <Link to="/contact" className={getLinkClasses("/contact")}>
                    Contact Us
                  </Link>
                  <div className="pl-4">
                    <Button />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`sm:hidden transition-all duration-200 ${mobileOpen ? "block" : "hidden"}`} id="mobile-menu">
        <div className="space-y-1 px-2 pt-2 pb-3">
          <Link to="/home" className={getLinkClasses("/home", true)}>
            Home
          </Link>
             <Link to="/trainList" className={getLinkClasses("/about", true)}>
                Search Trains
              </Link>
          {isLogged ? (
            <Link to="/bookedtickets" className={getLinkClasses("/bookedtickets", true)}>
              Booked Tickets
            </Link>
          ) : (
            <>
              <Link to="/about" className={getLinkClasses("/about", true)}>
                About
              </Link>
              <Link to="/services" className={getLinkClasses("/services", true)}>
                Services
              </Link>
            </>
          )}
          <Link to="/policy" className={getLinkClasses("/policy", true)}>
            Policy
          </Link>
          <Link to="/contact" className={getLinkClasses("/contact", true)}>
            Contact Us
          </Link>
          <div className="pl-2">
            <Button />
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };