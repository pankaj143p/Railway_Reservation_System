import axios from "axios";
import { User } from "../../interfaces/User";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

const getToken = () => localStorage.getItem("token");

export const fetchUsers = async (): Promise<User[]> => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/api/users/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addUser = async (user: Partial<User>): Promise<User> => {
  const token = getToken();
  const res = await axios.post(`${API_URL}/api/users/register`, user, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const token = getToken();
  const res = await axios.put(`${API_URL}/${id}`, user, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  const token = getToken();
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

