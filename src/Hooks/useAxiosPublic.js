import axios from 'axios';

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

const useAxiosPublic = () => axiosPublic;

export default useAxiosPublic;