import axios, { type AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function apiRequest<T>(
  endpoint: string,
  options: AxiosRequestConfig = {},
): Promise<T> {
  try {
    const { data } = await api.request<T & { message?: string }>({
      url: endpoint,
      ...options,
    });
    return data as T;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const message =
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : 'Произошла ошибка при выполнении запроса';
      throw new Error(message);
    }
    throw error;
  }
}
