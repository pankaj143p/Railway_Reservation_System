import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Button = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  const handleClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group/button relative inline-flex items-center justify-center overflow-hidden rounded-md px-4 py-1 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl border border-white/20
        ${isLoggedIn ? "bg-red-500/80 hover:shadow-red-600/50" : "bg-blue-500/30 backdrop-blur-lg hover:shadow-blue-600/50"}
      `}
    >
      <span className="text-lg cursor-default">{isLoggedIn ? "Logout" : "Login"}</span>
      <div className={`absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]
        ${isLoggedIn ? "bg-red-400/30" : "bg-white/30"}
      `}>
        <div className="relative h-full w-10" />
      </div>
    </button>
  );
};

export default Button;