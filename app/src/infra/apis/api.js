import axios from 'axios';
import { authInterceptor } from './inteceptors/authInterceptor';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(authInterceptor);

export const vercelApi = axios.create({
  baseURL: 'https://comunica-car.vercel.app',
});
