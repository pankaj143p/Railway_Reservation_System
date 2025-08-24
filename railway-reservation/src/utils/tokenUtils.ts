import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  email: string;
  role: string;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Consider invalid tokens as expired
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = '/login';
};

export const checkTokenAndLogout = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) {
    logout();
    return true;
  }
  
  if (isTokenExpired(token)) {
    logout();
    return true;
  }
  
  return false;
};