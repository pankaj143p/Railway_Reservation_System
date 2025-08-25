import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkTokenAndLogout } from "../../utils/tokenUtils";

const ProtectedHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token is expired first
    if (checkTokenAndLogout()) {
      return; // Will redirect to login automatically
    }

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); 

    if (token) {
      if (role === "ROLE_ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "ROLE_USER") {
        navigate("/trainList", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  // Optional: Show a loading message while redirecting
  return <div style={{ textAlign: "center", marginTop: "2rem" }}>Redirecting...</div>;
};

export default ProtectedHome;