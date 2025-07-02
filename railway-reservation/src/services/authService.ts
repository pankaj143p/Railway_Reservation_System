import axios from 'axios';
import { LoginResponse } from '../interfaces/res';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

export const loginUser = async (
    email: string,
    password: string
  ): Promise<string> => {
    try {
      const res = await axios.post<LoginResponse>(`${API_URL}/api/users/login`, { email, password });

      const users = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
          webCredentials: true 
        }
      });
      console.log("users ",users.data);
      
  
      return res.data.token;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  

export async function registerUser(fullName: string, email: string, phone: string, password: string, role = "USER") {
  const response = await fetch(`${API_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, phone, password, role }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Show validation error if present
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      throw new Error(data.errors[0].defaultMessage);
    }
    throw new Error(data.message || 'Signup failed. Please try again.');
  }

  return data;
}