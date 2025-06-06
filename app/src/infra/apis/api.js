// create an axios instance
import axios from 'axios';
import { authInterceptor } from './inteceptors/authInterceptor';

export const api = axios.create({
  baseURL: 'https://comunicacar.onrender.com',
});

api.interceptors.request.use(authInterceptor);
