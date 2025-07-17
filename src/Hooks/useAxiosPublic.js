import axios from 'axios';
import { getAuth } from 'firebase/auth';

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

// Interceptor to attach Firebase JWT token
axiosPublic.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Hook to use the axios instance
const useAxiosPublic = () => axiosPublic;

export default useAxiosPublic;
