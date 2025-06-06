import { api } from '../infra/apis/api';

export async function getServices(page = 0, size = 10) {
  try {
    const response = await api.get(`/services?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    throw error;
  }
}
