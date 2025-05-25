import axios from 'axios';
import { LoginResponse } from '../interfaces/res';

const API_URL = 'http://localhost:6111/api/users';
export const loginUser = async (
    email: string,
    password: string
  ): Promise<string> => {
    try {
      const res = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });

      const users = await axios.get("http://localhost:6111/api/users", {
        headers: {
          Authorization: `Bearer ${res.data.token}`
        }
      });
      console.log("users ",users.data);
      
  
      return res.data.token;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };
  
export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
  role: string,
  phone: string
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/register`, {
      fullName,
      email,
      password,
      role,
      phone,
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};


