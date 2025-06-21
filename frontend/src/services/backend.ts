import axios from "axios";

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080";

const backendApi = axios.create({
  baseURL: backendBaseUrl,
});

export async function getServiceById(id: string) {
  const response = await backendApi.get(`/services/public/${id}`);
  return response.data;
}
