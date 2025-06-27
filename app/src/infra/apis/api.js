import axios from 'axios';
import { authInterceptor } from './inteceptors/authInterceptor';

export const api = axios.create({
  baseURL: 'https://comunicacar.onrender.com',
});

api.interceptors.request.use(authInterceptor);

export const vercelApi = axios.create({
  baseURL: 'https://comunica-car.vercel.app',
});
