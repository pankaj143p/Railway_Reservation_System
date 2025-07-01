import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // "admin" or "user"
    
    
    if (token) {
      if (role === "ROLE_ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "ROLE_USER") {
        navigate("/trainList", { replace: true });
      } else {
        // Unknown role, fallback
        navigate("/login", { replace: true });
      }
    }else{
      navigate("/home", { replace: true }); // Redirect to login if no token
    }
  }, [navigate]);

  return null;
};

export default ProtectedHome;