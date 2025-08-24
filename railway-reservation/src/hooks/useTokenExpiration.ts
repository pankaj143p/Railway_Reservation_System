import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired, getTokenExpirationTime, logout } from '../utils/tokenUtils';

export const useTokenExpiration = () => {
  const navigate = useNavigate();

  const checkAndLogout = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    if (isTokenExpired(token)) {
      console.log('Token expired, logging out...');
      logout();
      return;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Check immediately
    checkAndLogout();

    // Set up interval to check every minute
    const interval = setInterval(checkAndLogout, 60000); // Check every minute

    // Set up timeout for exact expiration time
    const expirationTime = getTokenExpirationTime(token);
    if (expirationTime) {
      const timeUntilExpiration = expirationTime - Date.now();
      if (timeUntilExpiration > 0) {
        const timeoutId = setTimeout(() => {
          console.log('Token expired, logging out...');
          logout();
        }, timeUntilExpiration);

        return () => {
          clearInterval(interval);
          clearTimeout(timeoutId);
        };
      }
    }

    return () => clearInterval(interval);
  }, [checkAndLogout]);

  return { checkAndLogout };
};