import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
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