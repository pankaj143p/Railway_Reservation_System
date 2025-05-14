const token = localStorage.getItem("token");
import axios from "axios";
axios.get("http://192.168.0.100:6111/api/users", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});


