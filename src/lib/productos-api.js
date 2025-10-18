import apiClient from './api-client';

export async function buscarProductos(query) {
  try {
    const response = await apiClient.get('/productos/api/productos');
    return response.data;
  } catch (error) {
    console.error('Error fetching productos:', error);
    throw error;
  }
}