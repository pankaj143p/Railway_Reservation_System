// const token = localStorage.getItem("token");
import axios from "axios";

// export const usersData = await axios.get("http://localhost:6111/api/users", {
//   headers: {
//     Authorization: `Bearer ${token}`
//   }
// });

// console.log("users ",usersData.data);

export const usersData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const response = await axios.get("http://localhost:6111/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("users", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};



