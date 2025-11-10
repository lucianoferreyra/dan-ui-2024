import apiClient from './api-client';

export async function buscarProductos(filters = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filters.nombre) {
      params.append('nombre', filters.nombre);
    }
    if (filters.precioMin !== undefined && filters.precioMin !== '') {
      params.append('precioMin', filters.precioMin);
    }
    if (filters.precioMax !== undefined && filters.precioMax !== '') {
      params.append('precioMax', filters.precioMax);
    }
    if (filters.stockMin !== undefined && filters.stockMin !== '') {
      params.append('stockMin', filters.stockMin);
    }
    if (filters.stockMax !== undefined && filters.stockMax !== '') {
      params.append('stockMax', filters.stockMax);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/productos/api/productos?${queryString}` : '/productos/api/productos';
    
    const response = await apiClient.get(url);
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

export async function actualizarProducto(productoId, productoData) {
  try {
    const response = await apiClient.put(`/productos/api/productos/${productoId}`, productoData);
    return response.data;
  } catch (error) {
    console.error('Error updating producto:', error);
    throw error;
  }
}

export async function eliminarProducto(productoId) {
  try {
    const response = await apiClient.delete(`/productos/api/productos/${productoId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting producto:', error);
    throw error;
  }
}