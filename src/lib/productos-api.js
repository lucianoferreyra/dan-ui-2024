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

export async function crearProducto(productoData) {
  try {
    const response = await apiClient.post('/productos/api/productos', productoData);
    return response.data;
  } catch (error) {
    console.error('Error creating producto:', error);
    throw error;
  }
}

export async function obtenerProductoPorId(productoId) {
  try {
    const response = await apiClient.get(`/productos/api/productos/${productoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching producto by ID:', error);
    throw error;
  }
}

export async function obtenerCategorias() {
  try {
    const response = await apiClient.get('/productos/api/categorias');
    return response.data;
  } catch (error) {
    console.error('Error fetching categorias:', error);
    throw error;
  }
}