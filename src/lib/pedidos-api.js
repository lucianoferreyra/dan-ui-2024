import apiClient from './api-client';

// Obtener todos los pedidos con filtros opcionales
export const getPedidos = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.clienteId) {
      params.append('clienteId', filters.clienteId);
    }
    
    if (filters.estado) {
      params.append('estado', filters.estado);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/pedidos/api/pedidos?${queryString}` : '/pedidos/api/pedidos';
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching pedidos:', error);
    throw error;
  }
};

// Obtener un pedido por ID
export const getPedidoById = async (id) => {
  try {
    const response = await apiClient.get(`/pedidos/api/pedidos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pedido ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo pedido
export const createPedido = async (pedidoData) => {
  try {
    const response = await apiClient.post('/pedidos/api/pedidos', pedidoData);
    return response.data;
  } catch (error) {
    console.error('Error creating pedido:', error);
    throw error;
  }
};

// Actualizar el estado de un pedido
export const updateEstadoPedido = async (id, estado) => {
  try {
    const response = await apiClient.patch(`/pedidos/api/pedidos/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    console.error(`Error updating estado for pedido ${id}:`, error);
    throw error;
  }
};

// Estados disponibles
export const ESTADOS_PEDIDO = {
  PENDIENTE: 'PENDIENTE',
  ACEPTADO: 'ACEPTADO',
  EN_PREPARACION: 'EN_PREPARACION',
  CONFIRMADO: 'CONFIRMADO',
  ENVIADO: 'ENVIADO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
  RECHAZADO: 'RECHAZADO',
  RECIBIDO: 'RECIBIDO'
};

// Etiquetas en español para los estados
export const ESTADO_LABELS = {
  PENDIENTE: 'Pendiente',
  ACEPTADO: 'Aceptado',
  EN_PREPARACION: 'En Preparación',
  CONFIRMADO: 'Confirmado',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
  RECHAZADO: 'Rechazado',
  RECIBIDO: 'Recibido'
};

// Colores para los estados
export const ESTADO_COLORS = {
  PENDIENTE: '#fbbf24',
  ACEPTADO: '#34d399',
  EN_PREPARACION: '#60a5fa',
  CONFIRMADO: '#a78bfa',
  ENVIADO: '#818cf8',
  ENTREGADO: '#10b981',
  CANCELADO: '#ef4444',
  RECHAZADO: '#dc2626',
  RECIBIDO: '#94a3b8'
};
