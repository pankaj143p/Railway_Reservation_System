import axios from "axios";
import { User } from "../../interfaces/User";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
console.log('API URL:', API_URL);


const getToken = () => localStorage.getItem("token");

// Get all users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const token = getToken();
    console.log('Fetching all users from:', `${API_URL}/api/users`);
    const res = await axios.get(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Users fetched:', res.data, 'Type:', typeof res.data, 'Is Array:', Array.isArray(res.data));
    
    if (Array.isArray(res.data)) {
      return res.data;
    } else {
      console.error('fetchUsers did not return an array:', res.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Create a new user (renamed from addUser to createUser for consistency)
export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  try {
    const token = getToken();
    console.log('Creating user:', user);
    const res = await axios.post(`${API_URL}/api/users/register`, user, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('User created successfully:', res.data);
    
    // The backend returns { message, user, timestamp }, so extract the user
    return res.data.user || res.data;
  } catch (error) {
    console.error('Error creating user:', error);
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response: { data: any; status: any } };
      console.error('Error response:', err.response.data);
      console.error('Error status:', err.response.status);
    }
    throw error;
  }
};

// Keep addUser for backward compatibility
export const addUser = createUser;

// Update user
export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  try {
    const token = getToken();
    console.log(`Updating user with ID: ${id}`, user);
    const res = await axios.put(`${API_URL}/api/users/${id}`, user, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('User updated successfully:', res.data);
    
    // The backend returns { message, user, timestamp }, so extract the user
    return res.data.user || res.data;
  } catch (error) {
    console.error('Error updating user:', error);
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response: { data: any; status: any } };
      console.error('Error response:', err.response.data);
      console.error('Error status:', err.response.status);
    }
    throw error;
  }
};

// Delete user (soft delete)
export const deleteUser = async (id: number): Promise<any> => {
  try {
    const token = getToken();
    console.log(`Deleting user with ID: ${id}`);
  const res = await axios.patch(`${API_URL}/api/users/${id}`,{}, {
  headers: { Authorization: `Bearer ${token}` }
});
    console.log('User deleted successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response: { data: any; status: any } };
      console.error('Error response:', err.response.data);
      console.error('Error status:', err.response.status);
    }
    throw error;
  }
};

// Reactivate user
export const reactivateUser = async (id: number): Promise<any> => {
  try {
    const token = getToken();
    console.log(`Reactivating user with ID: ${id}`);
    const res = await axios.patch(`${API_URL}/api/users/${id}/reactivate`, {}, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('User reactivated successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error reactivating user:', error);
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response: { data: any; status: any } };
      console.error('Error response:', err.response.data);
      console.error('Error status:', err.response.status);
    }
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const token = getToken();
    console.log(`Fetching user with ID: ${id}`);
    const res = await axios.get(`${API_URL}/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('User fetched:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response: { data: any; status: any } };
      console.error('Error response:', err.response.data);
      console.error('Error status:', err.response.status);
    }
    throw error;
  }
};

// Get inactive users
export const fetchInactiveUsers = async (): Promise<User[]> => {
  try {
    const token = getToken();
    console.log('Fetching inactive users');
    const res = await axios.get(`${API_URL}/api/users/inactive`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (Array.isArray(res.data)) {
      return res.data;
    } else {
      console.error('fetchInactiveUsers did not return an array:', res.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching inactive users:', error);
    return [];
  }
};

// Login user
export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    console.log('Logging in user:', credentials.email);
    const res = await axios.post(`${API_URL}/api/users/login`, credentials, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Login successful:', res.data);
    return res.data;
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

// Validate token
export const validateToken = async (token: string): Promise<any> => {
  try {
    console.log('Validating token');
    const res = await axios.post(`${API_URL}/api/users/validate-token`, 
      { token }, 
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log('Token validation successful:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error validating token:', error);
    throw error;
  }
};

// Forgot password
export const forgotPassword = async (email: string, appUrl: string): Promise<any> => {
  try {
    console.log('Initiating password reset for:', email);
    const res = await axios.post(`${API_URL}/api/users/forgot-password`, 
      { email, appUrl }, 
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log('Password reset initiated:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error initiating password reset:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (token: string, newPassword: string): Promise<any> => {
  try {
    console.log('Resetting password');
    const res = await axios.post(`${API_URL}/api/users/reset-password`, 
      { token, newPassword }, 
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log('Password reset successful:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};