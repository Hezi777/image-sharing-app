import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../providers/AuthProvider';

export const useAxiosAuth = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        // Only redirect to login for authenticated endpoints, not public ones like GET /images
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
