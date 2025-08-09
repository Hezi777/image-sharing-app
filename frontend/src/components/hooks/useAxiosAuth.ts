// Custom hook to set up axios response interceptor for handling 401 errors
// Automatically logs out user and redirects to login when JWT token expires

import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../providers/AuthProvider';

export const useAxiosAuth = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        // Handle 401 errors but skip public endpoints like GET /images
        if (err?.response?.status === 401 && 
            !(err?.config?.url?.includes('/images') && err?.config?.method === 'get')) {
          logout();
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);
};
