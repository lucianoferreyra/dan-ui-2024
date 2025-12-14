import apiClient from './api-client';
import { obtenerClientePorId } from './clientes-api';
import { obtenerObraPorId } from './obras-api';
import { obtenerProductoPorId } from './productos-api';

// Enriquecer un pedido con información de cliente, obra y productos
const enriquecerPedido = async (pedido) => {
  try {
    // Obtener información del cliente
    let cliente = null;
    if (pedido.clienteId) {
      try {
        cliente = await obtenerClientePorId(pedido.clienteId);
      } catch (error) {
        console.error(`Error obteniendo cliente ${pedido.clienteId}:`, error);
      }
    }

    // Obtener información de la obra
    let obra = null;
    if (pedido.obraId) {
      try {
        obra = await obtenerObraPorId(pedido.obraId);
      } catch (error) {
        console.error(`Error obteniendo obra ${pedido.obraId}:`, error);
      }
    }

    // Obtener información de los productos en los detalles
    let detallesEnriquecidos = [];
    if (pedido.detalles && pedido.detalles.length > 0) {
      detallesEnriquecidos = await Promise.all(
        pedido.detalles.map(async (detalle) => {
          let producto = null;
          if (detalle.productoId) {
            try {
              producto = await obtenerProductoPorId(detalle.productoId);
            } catch (error) {
              console.error(`Error obteniendo producto ${detalle.productoId}:`, error);
            }
          }
          return {
            ...detalle,
            producto
          };
        })
      );
    }

    return {
      ...pedido,
      cliente,
      obra,
      detalles: detallesEnriquecidos
    };
  } catch (error) {
    console.error('Error enriqueciendo pedido:', error);
    return pedido;
  }
};

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
    const pedidos = response.data;

    // Enriquecer cada pedido con información completa
    const pedidosEnriquecidos = await Promise.all(
      pedidos.map(pedido => enriquecerPedido(pedido))
    );

    return pedidosEnriquecidos;
  } catch (error) {
    console.error('Error fetching pedidos:', error);
    throw error;
  }
};

// Obtener un pedido por ID
export const getPedidoById = async (id) => {
  try {
    const response = await apiClient.get(`/pedidos/api/pedidos/${id}`);
    const pedido = response.data;

    // Enriquecer el pedido con información completa
    const pedidoEnriquecido = await enriquecerPedido(pedido);

    return pedidoEnriquecido;
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
    const response = await apiClient.put(`/pedidos/api/pedidos/${id}/estado`, { nuevoEstado: estado });
    return response.data;
  } catch (error) {
    console.error(`Error updating estado for pedido ${id}:`, error);
    throw error;
  }
};

// Estados disponibles
export const ESTADOS_PEDIDO = {
  ACEPTADO: 'ACEPTADO',
  EN_PREPARACION: 'EN_PREPARACION',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
  RECHAZADO: 'RECHAZADO',
  RECIBIDO: 'RECIBIDO'
};

// Etiquetas en español para los estados
export const ESTADO_LABELS = {
  ACEPTADO: 'Aceptado',
  EN_PREPARACION: 'En Preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
  RECHAZADO: 'Rechazado',
  RECIBIDO: 'Recibido'
};

// Colores para los estados
export const ESTADO_COLORS = {
  ACEPTADO: '#34d399',
  EN_PREPARACION: '#60a5fa',
  ENTREGADO: '#10b981',
  CANCELADO: '#ef4444',
  RECHAZADO: '#dc2626',
  RECIBIDO: '#94a3b8'
};
