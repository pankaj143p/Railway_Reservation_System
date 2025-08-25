import apiClient from './api/axiosConfig';
import { LoginResponse } from '../interfaces/res';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

export const loginUser = async (
    email: string,
    password: string
  ): Promise<string> => {
    try {
      console.log('Logging in user:', email);
      const res = await apiClient.post('/api/users/login', { email, password });
      console.log('Login successful:', res.data);
      return res.data; // Assuming this returns the JWT token
    } catch (error) {
      console.error('Error logging in:', error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response: { data: any; status: any } };
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
      }
      throw error;
    }
  };

export async function registerUser(fullName: string, email: string, phone: string, password: string, role = "USER") {
  const response = await apiClient.post('/api/users/register', {
    fullName, email, phone, password, role
  });

  const data = response.data;

  if (response.status !== 200 && response.status !== 201) {
    // Show validation error if present
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      throw new Error(data.errors[0].defaultMessage);
    }
    throw new Error(data.message || 'Signup failed. Please try again.');
  }

  return data;
}

export const forgotPassword = async (email: string, appUrl: string): Promise<any> => {
  try {
    console.log('Initiating password reset for:', email);
    const res = await apiClient.post(`/api/users/forgot-password?email=${encodeURIComponent(email)}&appUrl=${encodeURIComponent(appUrl)}`);
    console.log('Password reset initiated:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error initiating password reset:', error);
    throw error;
  }
};

export const validateToken = async (token: string): Promise<any> => {
  const res = await apiClient.post('/api/users/validate-token', { token });
  return res.data;
};

export const resetPassword = async (token: string, newPassword: string): Promise<any> => {
  const res = await apiClient.post(
    `/api/users/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`
  );
  return res.data;
};